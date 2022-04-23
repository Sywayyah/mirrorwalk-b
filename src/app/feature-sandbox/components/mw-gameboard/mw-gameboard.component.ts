import { Component, OnInit } from '@angular/core';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import {
  BattleStateService as MwBattleStateService,
  MwNeutralPlayerService,
  MwPlayerStateService,
} from '../../services';

@Component({
  selector: 'mw-mw-gameboard',
  templateUrl: './mw-gameboard.component.html',
  styleUrls: ['./mw-gameboard.component.scss'],
})
export class MwGameboardComponent implements OnInit {
  public mainPlayerUnitGroups!: UnitGroupModel[];
  public neutralPlayerGroups!: UnitGroupModel[];

  public mainPlayerInfo!: PlayerModel;
  public neutralPlayerInfo!: PlayerModel;

  public fightQueue!: UnitGroupModel[];

  constructor(
    public readonly mwPlayerState: MwPlayerStateService,
    private readonly mwNeutralPlayer: MwNeutralPlayerService,
    public readonly mwBattleState: MwBattleStateService
  ) { }

  ngOnInit(): void {
    this.mainPlayerUnitGroups = this.mwPlayerState.getUnitGroups();
    this.neutralPlayerGroups = this.mwNeutralPlayer.getUnitGroups();

    this.mainPlayerInfo = this.mwPlayerState.getPlayerInfo();
    this.neutralPlayerInfo = this.mwNeutralPlayer.getPlayerInfo();

    this.mwBattleState.initBattle(
      [...this.mainPlayerUnitGroups, ...this.neutralPlayerGroups],
      [this.mainPlayerInfo, this.neutralPlayerInfo]
    );

    this.fightQueue = this.mwBattleState.getFightQueue();

    this.mwBattleState.battleEvent.subscribe(() => {
      this.mainPlayerUnitGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.mainPlayerInfo) as UnitGroupModel[]
      this.neutralPlayerGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.neutralPlayerInfo) as UnitGroupModel[];
      this.fightQueue = this.mwBattleState.getFightQueue();
    });
  }
}
