import { Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerModel } from 'src/app/core/players';
import { SpellActivationType, SpellInstance } from 'src/app/core/spells';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { UIModsModel, BattleStateService, MwPlayersService, MwUnitGroupStateService, MwUnitGroupsService } from 'src/app/features/services';
import { GroupModifiersChanged, GroupSpellsChanged, PlayerHoversGroupCard, HoverTypeEnum } from 'src/app/features/services/events';
import { HintAttachment } from 'src/app/features/shared/components';
import { PROVIDE_UI_UNIT_GROUP, UIUnitProvider } from 'src/app/features/shared/directives';
import { StoreClient } from 'src/app/store';

@Component({
  selector: 'mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss'],
  providers: [
    { provide: PROVIDE_UI_UNIT_GROUP, useExisting: forwardRef(() => MwUnitGroupCardComponent) }
  ],
})
export class MwUnitGroupCardComponent extends StoreClient() implements UIUnitProvider, OnInit, OnDestroy {

  @Input()
  public unitGroup!: UnitGroupInstModel;

  @Input()
  public playerInfo!: PlayerModel;

  @Input()
  public side: 'left' | 'right' = 'left';

  @Output()
  public cardReady: EventEmitter<MwUnitGroupCardComponent> = new EventEmitter();
  @Output()
  public groupDies: EventEmitter<void> = new EventEmitter();

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  // public potentialUnitCountLoss: number = 0;
  public attackingUnitGroup!: UnitGroupInstModel;

  public canCurrentPlayerAttack: boolean = false;
  public isGroupMelee: boolean = false;
  public modsForUi!: UIModsModel;

  public initialCount: number = 0;

  public spells: SpellInstance[] = [];
  public effects: SpellInstance[] = [];

  public spellsHintsPosition!: HintAttachment;

  private destroy$: Subject<void> = new Subject();

  constructor(
    public hostElem: ElementRef,
    public mwBattleStateService: BattleStateService,
    private playersService: MwPlayersService,
    private readonly unitsService: MwUnitGroupStateService,
    private readonly units: MwUnitGroupsService,
    private readonly renderer: Renderer2,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.spellsHintsPosition = this.side === 'left' ? 'above' : 'below';
    this.isGroupMelee = !this.unitsService.isUnitGroupRanged(this.unitGroup);
    this.isEnemyCard = this.playersService.getCurrentPlayer() !== this.playerInfo;
    this.initialCount = this.unitGroup.count;
    this.cardReady.next(this);

    /* Self-animating for summoned units.  */
    // In future, this approach is most likely going to change, I might introduce
    // some animating container, that will be able to animate any given element.
    // Which is going to be useful for fight queue as well.
    const isSummoned = this.unitGroup.modifiers.find(mod => mod.isSummon);
    if (isSummoned) {
      this.renderer.addClass(this.hostElem.nativeElement, 'summoned');
    }

    this.updateSpellsAndEffects();
    this.modsForUi = this.units.calcUiMods(this.unitGroup);

    this.events.eventStream$
      .pipe(
        takeUntil(this.destroyed$),
      )
      .subscribe(() => {
        // console.log('')
        const currentUnitGroup = this.mwBattleStateService.currentUnitGroup;
        this.attackingUnitGroup = currentUnitGroup;
        this.canCurrentPlayerAttack = this.mwBattleStateService.currentPlayer === this.playersService.getCurrentPlayer();
      });

    this.events.onEvent(GroupModifiersChanged).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(event => {
      if (event.unitGroup === this.unitGroup) {
        this.modsForUi = this.units.calcUiMods(this.unitGroup);
      }
    });

    this.events.onEvent(GroupSpellsChanged).pipe(
      takeUntil(this.destroyed$)
    ).subscribe(event => {
      if (event.unitGroup === this.unitGroup) {
        this.updateSpellsAndEffects();
      }
    });
  }

  public onDestroyed(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.events.dispatch(PlayerHoversGroupCard({
      hoverType: HoverTypeEnum.Unhover,
    }))
    this.groupDies.next();
  }


  public onCardHover(isHovered: boolean): void {
    this.isCardHovered = isHovered;

    if (isHovered) {
      if (!this.unitGroup.fightInfo.isAlive) {
        this.events.dispatch(PlayerHoversGroupCard({
          hoverType: HoverTypeEnum.Unhover,
        }))
        return;
      }

      this.events.dispatch(PlayerHoversGroupCard({
        hoverType: this.isEnemyCard ? HoverTypeEnum.EnemyCard : HoverTypeEnum.AllyCard,
        currentCard: this.mwBattleStateService.currentUnitGroup,
        hoveredCard: this.unitGroup,
      }));
    } else {
      this.events.dispatch(PlayerHoversGroupCard({
        hoverType: HoverTypeEnum.Unhover
      }));
    }
  }

  public getUnitGroup(): UnitGroupInstModel {
    return this.unitGroup;
  }

  public updateSpellsAndEffects(): void {
    const spells = this.unitGroup.spells;
    this.effects = spells.filter(spell =>
      [
        SpellActivationType.Buff,
        SpellActivationType.Debuff,
      ].includes(spell.baseType.activationType)
    );

    this.spells = spells.filter(spell =>
      [
        SpellActivationType.Instant,
        SpellActivationType.Passive,
        SpellActivationType.Target
      ].includes(spell.baseType.activationType)
    )
  }

}
