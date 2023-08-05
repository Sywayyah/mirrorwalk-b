import { Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GroupSpellsChanged, HoverTypeEnum, PlayerHoversGroupCard } from 'src/app/core/events';
import { Player } from 'src/app/core/players';
import { Spell, SpellActivationType } from 'src/app/core/spells';
import { UnitGroup, UnitStatsInfo } from 'src/app/core/unit-types';
import { BattleStateService, MwPlayersService, MwUnitGroupsService, MwUnitGroupStateService } from 'src/app/features/services';
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
  public unitGroup!: UnitGroup;

  @Input()
  public playerInfo!: Player;

  @Input()
  public side: 'left' | 'right' = 'left';

  @Output()
  public cardReady: EventEmitter<MwUnitGroupCardComponent> = new EventEmitter();
  @Output()
  public groupDies: EventEmitter<void> = new EventEmitter();

  public isCardHovered: boolean = false;
  public isEnemyCard!: boolean;

  // public potentialUnitCountLoss: number = 0;
  public attackingUnitGroup!: UnitGroup;

  public canCurrentPlayerAttack: boolean = false;
  public isGroupMelee: boolean = false;

  public unitStats$!: Observable<UnitStatsInfo>;

  public initialCount: number = 0;

  // todo: revisit, can become part of stats or something
  public spells: Spell[] = [];
  public effects: Spell[] = [];

  public spellsHintsPosition!: HintAttachment;

  public isBoss?: boolean = false;

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
    this.spellsHintsPosition = 'above';

    // this.spellsHintsPosition = this.side === 'left' ? 'above' : 'below';

    this.isGroupMelee = !this.unitsService.isUnitGroupRanged(this.unitGroup);
    this.isEnemyCard = this.playersService.getCurrentPlayer() !== this.playerInfo;
    this.initialCount = this.unitGroup.count;
    this.isBoss = this.unitGroup.type.defaultModifiers?.isBoss;
    this.cardReady.next(this);
    this.unitStats$ = this.unitGroup.listenStats();

    /* Self-animating for summoned units.  */
    // In future, this approach is most likely going to change, I might introduce
    // some animating container, that will be able to animate any given element.
    // Which is going to be useful for fight queue as well.
    const isSummoned = this.unitGroup.modGroup.getModValue('isSummon');

    if (isSummoned) {
      this.renderer.addClass(this.hostElem.nativeElement, 'summoned');
    }

    this.updateSpellsAndEffects();

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

  public getUnitGroup(): UnitGroup {
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
