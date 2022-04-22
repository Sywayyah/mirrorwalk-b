import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('historyLog', { static: true }) public historyLogElem!: ElementRef;

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

    this.mwBattleState.historyEvent$.subscribe(() => {
      const historyElem = this.historyLogElem.nativeElement;
      setTimeout(() => {
        historyElem.scrollTo({ top: historyElem.scrollHeight, behavior: 'smooth'});
      }, 0);
    });

    this.mwBattleState.battleEvent.subscribe(() => {
      this.mainPlayerUnitGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.mainPlayerInfo) as UnitGroupModel[]
      this.neutralPlayerGroups = this.mwBattleState.heroesUnitGroupsMap.get(this.neutralPlayerInfo) as UnitGroupModel[];
      this.fightQueue = this.mwBattleState.getFightQueue();
    });
  }
}
