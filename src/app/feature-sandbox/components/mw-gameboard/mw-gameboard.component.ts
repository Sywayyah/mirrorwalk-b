import { AfterViewInit, ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { PlayerInstanceModel } from 'src/app/core/players';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { getDamageParts } from 'src/app/core/vfx';
import { BattleStateService as MwBattleStateService, CombatInteractorService, MwCardsMappingService, MwNeutralPlayerService, MwPlayerStateService } from '../../services';
import { GroupDamagedByGroup, GroupDamagedByGroupEvent, PlayerStartsFight } from '../../services/events';
import { StoreClient, WireMethod } from '../../services/store';
import { MwUnitGroupCardComponent } from '../mw-unit-group-card/mw-unit-group-card.component';
import { VfxService } from '../ui-elements/vfx-layer/vfx.service';

@Component({
  selector: 'mw-mw-gameboard',
  templateUrl: './mw-gameboard.component.html',
  styleUrls: ['./mw-gameboard.component.scss'],
})
export class MwGameboardComponent extends StoreClient() implements OnInit, AfterViewInit {
  public mainPlayerUnitGroups!: UnitGroupInstModel[];
  public neutralPlayerGroups!: UnitGroupInstModel[];

  public mainPlayerInfo!: PlayerInstanceModel;
  public neutralPlayerInfo!: PlayerInstanceModel;

  public fightQueue!: UnitGroupInstModel[];

  @ViewChildren(MwUnitGroupCardComponent)
  public cards!: QueryList<MwUnitGroupCardComponent>;

  constructor(
    public readonly mwPlayerState: MwPlayerStateService,
    public readonly mwBattleState: MwBattleStateService,
    private readonly mwNeutralPlayer: MwNeutralPlayerService,
    private readonly cardsMapping: MwCardsMappingService,
    private readonly combatInteractor: CombatInteractorService,
    private readonly vfx: VfxService,
    private readonly cd: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    /* todo: potentially, a good place for ordering dependencies and logic order */
    this.mainPlayerUnitGroups = this.mwPlayerState.getUnitGroups();
    this.neutralPlayerGroups = this.mwNeutralPlayer.getUnitGroups();

    this.mainPlayerInfo = this.mwPlayerState.getPlayerInfo();
    this.neutralPlayerInfo = this.mwNeutralPlayer.getPlayerInfo();

    this.fightQueue = this.mwBattleState.getFightQueue();
  }

  public onCardReady(unitGroup: UnitGroupInstModel, cardRef: MwUnitGroupCardComponent): void {
    // this.cardsMapping.register(unitGroup, cardRef);
  }

  public onGroupDies(unitGroup: UnitGroupInstModel): void {
    /* todo: questionable */
    this.cardsMapping.unregister(unitGroup);
  }

  public ngAfterViewInit(): void {
    /* todo: might work poorly if there will be summoned units */
    this.cards.forEach(card => this.cardsMapping.register(card.unitGroup, card));

    /* init interactions only after view initialized and cards are available */
    this.initInteractions();

    this.cd.detectChanges();
  }

  private initInteractions(): void {
    this.combatInteractor.onBattleBegins();

    this.events.dispatch(PlayerStartsFight({
      players: [this.mainPlayerInfo, this.neutralPlayerInfo],
      unitGroups: [...this.mainPlayerUnitGroups, ...this.neutralPlayerGroups],
    }));

    this.updateFightQueue();

    this.events.eventStream$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      this.mainPlayerUnitGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.mainPlayerInfo) as UnitGroupInstModel[];
      this.neutralPlayerGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.neutralPlayerInfo) as UnitGroupInstModel[];
      this.updateFightQueue();
    });
  }

  private updateFightQueue() {
    this.fightQueue = this.mwBattleState.getFightQueue();
  }

  @WireMethod(GroupDamagedByGroup)
  public displayDamageVfxOverAttackedGroup(event: GroupDamagedByGroupEvent): void {
    /* previous solution was stacking because of no unsubscribe. */
    const isRanged = event.attackingGroup.type.defaultModifiers?.isRanged;
    this.vfx.createFloatingMessageForUnitGroup(event.attackedGroup, getDamageParts(event.damage, event.loss, isRanged));
  }
}

