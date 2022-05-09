import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import {
  BattleEventsService,
  BattleEventTypeEnum,
  BattleStateService as MwBattleStateService,
  MwNeutralPlayerService,
  MwPlayerStateService
} from '../../services';
import { MwCardsMappingService } from '../../services/mw-cards-mapping.service';
import { CombatInteractorService } from '../../services/mw-combat-interactor.service';
import { MwUnitGroupCardComponent } from '../mw-unit-group-card/mw-unit-group-card.component';

@Component({
  selector: 'mw-mw-gameboard',
  templateUrl: './mw-gameboard.component.html',
  styleUrls: ['./mw-gameboard.component.scss'],
})
export class MwGameboardComponent implements OnInit {
  public mainPlayerUnitGroups!: UnitGroupInstModel[];
  public neutralPlayerGroups!: UnitGroupInstModel[];

  public mainPlayerInfo!: PlayerInstanceModel;
  public neutralPlayerInfo!: PlayerInstanceModel;

  public fightQueue!: UnitGroupInstModel[];

  constructor(
    public readonly mwPlayerState: MwPlayerStateService,
    public readonly mwBattleState: MwBattleStateService,
    private readonly mwNeutralPlayer: MwNeutralPlayerService,
    private readonly cardsMapping: MwCardsMappingService,
    private readonly battleEvents: BattleEventsService,
    private readonly combatInteractor: CombatInteractorService,
  ) {
    this.combatInteractor.listenEvents();
  }

  public ngOnInit(): void {
    this.mainPlayerUnitGroups = this.mwPlayerState.getUnitGroups();
    this.neutralPlayerGroups = this.mwNeutralPlayer.getUnitGroups();

    this.mainPlayerInfo = this.mwPlayerState.getPlayerInfo();
    this.neutralPlayerInfo = this.mwNeutralPlayer.getPlayerInfo();

    this.mwBattleState.initBattle(
      [...this.mainPlayerUnitGroups, ...this.neutralPlayerGroups],
      [this.mainPlayerInfo, this.neutralPlayerInfo]
    );

    this.fightQueue = this.mwBattleState.getFightQueue();

    this.mwBattleState.battleEvent$.subscribe(() => {
      this.mainPlayerUnitGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.mainPlayerInfo) as UnitGroupInstModel[]
      this.neutralPlayerGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.neutralPlayerInfo) as UnitGroupInstModel[];
      this.fightQueue = this.mwBattleState.getFightQueue();
    });

    this.battleEvents.onEvent(BattleEventTypeEnum.On_Group_Damaged).subscribe((event) => {
      this.cardsMapping.get(event.attackedGroup).effectsComponent.addLossEffect(event.loss);
    });
  }

  public onCardReady(unitGroup: UnitGroupInstModel, cardRef: MwUnitGroupCardComponent): void {
    this.cardsMapping.register(unitGroup, cardRef);
  }

  public onGroupDies(unitGroup: UnitGroupInstModel): void {
    this.cardsMapping.unregister(unitGroup);
  }
}
