import { Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { PlayerModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { SpellActivationType, SpellInstance } from 'src/app/core/model/spells';
import { PROVIDE_UI_UNIT_GROUP, UIUnitProvider } from '../../directives/mw-unit-events-cursor.directive';
import { BattleEvent, BattleEventsService, BattleStateService, HoverTypeEnum, MwPlayersService, OnGroupModsChanged, OnGroupSpellsChanged } from '../../services';
import { MwUnitGroupStateService } from '../../services/mw-unit-group-state.service';
import { MwUnitGroupsService, UIModsModel } from '../../services/mw-unit-groups.service';
import { GameStoreClient } from '../../services/state/game-state.service';
import { SubscribeEvent } from '../../services/state/store-decorators.config';

@Component({
  selector: 'mw-unit-group-card',
  templateUrl: './mw-unit-group-card.component.html',
  styleUrls: ['./mw-unit-group-card.component.scss'],
  providers: [
    { provide: PROVIDE_UI_UNIT_GROUP, useExisting: forwardRef(() => MwUnitGroupCardComponent) }
  ],
})
export class MwUnitGroupCardComponent extends GameStoreClient() implements UIUnitProvider, OnInit, OnDestroy {

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

  private destroy$: Subject<void> = new Subject();

  constructor(
    public hostElem: ElementRef,
    public mwBattleStateService: BattleStateService,
    private playersService: MwPlayersService,
    private readonly battleEvents: BattleEventsService,
    private readonly unitsService: MwUnitGroupStateService,
    private readonly units: MwUnitGroupsService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.isGroupMelee = !this.unitsService.isUnitGroupRanged(this.unitGroup);
    this.isEnemyCard = this.playersService.getCurrentPlayer() !== this.playerInfo;
    this.initialCount = this.unitGroup.count;
    this.cardReady.next(this);

    this.updateSpellsAndEffects();
    this.modsForUi = this.units.calcUiMods(this.unitGroup);

    this.mwBattleStateService.battleEvent$
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const currentUnitGroup = this.mwBattleStateService.currentUnitGroup;
        this.attackingUnitGroup = currentUnitGroup;
        this.canCurrentPlayerAttack = this.mwBattleStateService.currentPlayer === this.playersService.getCurrentPlayer();
      });
  }

  public onDestroyed(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.battleEvents.dispatchEvent({ type: BattleEvent.UI_Player_Hovers_Group_Card, hoverType: HoverTypeEnum.Unhover });
    this.groupDies.next();
  }

  @SubscribeEvent(BattleEvent.OnGroupModifiersChagned)
  public updateMods(event$: Observable<OnGroupModsChanged>): Subscription {
    return event$.pipe(
      filter(event => event.unitGroup === this.unitGroup)
    ).subscribe(() => {
      this.modsForUi = this.units.calcUiMods(this.unitGroup);
    });
  }

  @SubscribeEvent(BattleEvent.OnGroupSpellsChanged)
  public updateSpellsOnChanged(event$: Observable<OnGroupSpellsChanged>): Subscription {
    return event$.pipe(
      filter(event => event.unitGroup === this.unitGroup),
    ).subscribe(() => {
      this.updateSpellsAndEffects();
    });
  }

  public onCardHover(isHovered: boolean): void {
    this.isCardHovered = isHovered;

    if (isHovered) {
      if (!this.unitGroup.fightInfo.isAlive) {
        this.battleEvents.dispatchEvent({ type: BattleEvent.UI_Player_Hovers_Group_Card, hoverType: HoverTypeEnum.Unhover });
        return;
      }

      this.battleEvents.dispatchEvent({
        type: BattleEvent.UI_Player_Hovers_Group_Card,
        hoverType: this.isEnemyCard ? HoverTypeEnum.EnemyCard : HoverTypeEnum.AllyCard,
        currentCard: this.mwBattleStateService.currentUnitGroup,
        hoveredCard: this.unitGroup,
      });
    } else {
      this.battleEvents.dispatchEvent({ type: BattleEvent.UI_Player_Hovers_Group_Card, hoverType: HoverTypeEnum.Unhover });
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
