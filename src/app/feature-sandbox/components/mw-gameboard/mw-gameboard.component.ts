import { Component, OnInit } from '@angular/core';
import { PlayerModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { BattleStateService as MwBattleStateService } from '../../services/mw-battle-state.service';
import { MwNeutralPlayerService } from '../../services/mw-neutral-player.service';
import { MwPlayerStateService } from '../../services/mw-player-state.service';

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
    private readonly mwPlayerState: MwPlayerStateService,
    private readonly mwNeutralPlayer: MwNeutralPlayerService,
    private readonly mwBattleState: MwBattleStateService
  ) {}

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
  }
}
