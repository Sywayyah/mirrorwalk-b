import { AfterViewInit, Component, OnInit, QueryList, ViewChildren, inject } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { GroupDamagedByGroup, GroupDamagedByGroupEvent, PlayerStartsFight, UnitSummoned, UnitSummonedEvent } from 'src/app/core/events';
import { DefendAction } from 'src/app/core/events/battle/commands';
import { Player } from 'src/app/core/players';
import { UnitsOrientation } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';
import { injectCdr } from 'src/app/core/utils';
import { LifestealAnimtaion, getDamageParts, getLifeStealParts } from 'src/app/core/vfx';
import { BattleStateService, CombatInteractorService, MwCardsMappingService, MwNeutralPlayerService, MwPlayerStateService, MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { VfxService } from 'src/app/features/shared/components';
import { StoreClient, WireMethod } from 'src/app/store';
import { MwUnitGroupCardComponent } from '../mw-unit-group-card/mw-unit-group-card.component';

@Component({
  selector: 'mw-gameboard',
  templateUrl: './mw-gameboard.component.html',
  styleUrls: ['./mw-gameboard.component.scss'],
  standalone: false
})
export class MwGameboardComponent extends StoreClient() implements OnInit, AfterViewInit {
  public readonly mwPlayerState = inject(MwPlayerStateService);
  public readonly players = inject(MwPlayersService);
  public readonly mwBattleState = inject(BattleStateService);
  private readonly mwNeutralPlayer = inject(MwNeutralPlayerService);
  private readonly cardsMapping = inject(MwCardsMappingService);
  private readonly combatInteractor = inject(CombatInteractorService);
  private readonly vfx = inject(VfxService);
  private readonly cd = injectCdr();
  private readonly state = inject(State);

  public mainPlayerUnitGroups!: UnitGroup[];
  public neutralPlayerGroups!: UnitGroup[];

  public mainPlayerInfo!: Player;
  public enemyPlayerInfo!: Player;

  public fightQueue!: UnitGroup[];

  @ViewChildren(MwUnitGroupCardComponent)
  public cards!: QueryList<MwUnitGroupCardComponent>;

  public settings = this.state.settings;

  public orientation = UnitsOrientation;

  public currentUnitGroup$ = this.mwBattleState.currentUnitGroup$;

  public canDefend$ = this.mwBattleState.currentUnitGroup$.pipe(
    map((unit) => Boolean(unit && !unit.getState().groupStats.defends && !this.players.isEnemyUnitGroup(unit)))
  );

  public defendActionMessage$ = this.mwBattleState.currentUnitGroup$.pipe(
    map((unit) => {
      if (!unit || this.players.isEnemyUnitGroup(unit)) {
        return '';
      }

      if (unit.getState().groupStats.defends) {
        return 'Unit group is already defending';
      }

      return `Defend ${unit.count} ${unit.type.name}`;
    })
  );


  public ngOnInit(): void {
    /* todo: potentially, a good place for ordering dependencies and logic order */
    this.mainPlayerUnitGroups = this.mwPlayerState.getUnitGroups();
    this.neutralPlayerGroups = this.mwNeutralPlayer.getUnitGroups();

    this.mainPlayerInfo = this.mwPlayerState.getPlayerInfo();
    this.enemyPlayerInfo = this.mwNeutralPlayer.getPlayerInfo();
  }

  public onGroupDies(unitGroup: UnitGroup): void {
    /* todo: questionable */
    this.cardsMapping.unregister(unitGroup);
  }

  public ngAfterViewInit(): void {
    /* todo: might work poorly if there will be summoned units */
    this.cards.forEach(card => this.cardsMapping.register(card.unitGroup(), card));

    /* init interactions only after view initialized and cards are available */
    this.initInteractions();

    this.cd.detectChanges();
  }

  private initInteractions(): void {
    this.combatInteractor.onBattleBegins();

    this.events.dispatch(PlayerStartsFight({
      players: [this.mainPlayerInfo, this.enemyPlayerInfo],
      unitGroups: [...this.mainPlayerUnitGroups, ...this.neutralPlayerGroups],
    }));

    this.updateFightQueue();

    // todo: optimize some day
    this.events.eventStream$.pipe(
      takeUntil(this.destroyed$),
    ).subscribe(() => {
      this.updatePlayersUnitGroupsToShow();
    });
  }

  public defend(): void {
    this.events.dispatch(DefendAction());
  }

  @WireMethod(GroupDamagedByGroup)
  public displayDamageVfxOverAttackedGroup(event: GroupDamagedByGroupEvent): void {
    /* previous solution was stacking because of no unsubscribe. */
    const isRanged = event.attackingGroup.type.defaultModifiers?.isRanged;

    if (event.lifeStolen) {
      this.vfx.createDroppingMessageForContainer(
        event.attackingGroup.id,
        getLifeStealParts(event.lifeStolenUnitsRestored, event.lifeStolen),
        { duration: 1600 },
      );

      this.vfx.createEffectAnimationForUnitGroup(event.attackingGroup, LifestealAnimtaion, {
        duration: 700,
        darkOverlay: false,
      });
    }

    this.vfx.createFloatingMessageForUnitGroup(
      event.attackedGroup,
      getDamageParts(event.damage, event.loss, isRanged, event.damageBlocked, event.isCritical),
      { duration: event.isCritical ? 1200 : event.damageBlocked ? 1100 : 1000 }
    );
  }

  @WireMethod(UnitSummoned)
  public registerSummonedUnit(event: UnitSummonedEvent): void {
    this.updatePlayersUnitGroupsToShow();

    this.cd.detectChanges();

    this.cardsMapping.register(event.unitGroup, this.cards.find(cardComponent => cardComponent.unitGroup() === event.unitGroup)!);
  }

  private updatePlayersUnitGroupsToShow(): void {
    this.mainPlayerUnitGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.mainPlayerInfo) as UnitGroup[];
    this.neutralPlayerGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.enemyPlayerInfo) as UnitGroup[];
    this.updateFightQueue();
  }

  private updateFightQueue() {
    this.fightQueue = this.mwBattleState.getFightQueue();
  }
}

