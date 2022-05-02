import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { UnitTypeModel } from 'src/app/core/model/main.model';
import { BattleEventsService, BattleEventTypeEnum, BattleStateService, MwPlayersService, RoundEndsEvent } from '../../services';

interface LossModel {
  type: UnitTypeModel;
  count: number;
};

interface PopupModel {
  isWin: boolean;
  playerLosses: LossModel[];
  enemyLosses: LossModel[];
}

@Component({
  selector: 'mw-popup-container',
  templateUrl: './mw-popup-container.component.html',
  styleUrls: ['./mw-popup-container.component.scss']
})
export class MwPopupContainerComponent implements OnInit {

  public popups: PopupModel[] = [];

  constructor(
    private readonly battleEvents: BattleEventsService,
    private readonly battleState: BattleStateService,
    private readonly playersService: MwPlayersService,
  ) {
    this.battleEvents.onEvent(BattleEventTypeEnum.Fight_Ends).subscribe((event: RoundEndsEvent) => {
      this.popups.push(
        {
          isWin: event.win,
          playerLosses: this.getPlayerLosses(this.playersService.getCurrentPlayerId()),
          enemyLosses: this.getPlayerLosses(this.playersService.getEnemyPlayer().id),
        }
      );
    });
  }

  private getPlayerLosses(playerId: string): LossModel[] {
    const playerLossesMap = this.battleState.playerLosses[playerId];

    return [...playerLossesMap].map(loss => ({ type: loss[0], count: loss[1] }));
  }

  ngOnInit(): void {
  }

}
