import { Component, OnInit } from '@angular/core';
import { NeutralCampStructure, NeutralRewardTypesEnum } from "src/app/core/model/structures.types";
import { BattleEvent, BattleEventsService, BattleStateService, DisplayPopupEvent, FightEndsPopup, LossModel, MwPlayersService, PopupModel, PopupTypesEnum, RoundEndsEvent, StructHireRewardPopup, StructItemRewardPopup, StructRewardPopup } from '../../services';
import { GameStore } from '../../services/state/game-state.service';
import { WireEvent, StoreClient } from '../../services/state/store-decorators.config';

@Component({
  selector: 'mw-popup-container',
  templateUrl: './mw-popup-container.component.html',
  styleUrls: ['./mw-popup-container.component.scss']
})
export class MwPopupContainerComponent extends StoreClient(GameStore) implements OnInit {

  public popups: PopupModel[] = [];
  public popupTypes: typeof PopupTypesEnum = PopupTypesEnum;

  constructor(
    private readonly battleEvents: BattleEventsService,
    private readonly battleState: BattleStateService,
    private readonly playersService: MwPlayersService,
  ) {
    super();

    this.battleEvents.onEvents({
      [BattleEvent.Fight_Ends]: (event: RoundEndsEvent) => {
        const fightEndsPopup: FightEndsPopup = {
          type: PopupTypesEnum.FightEnds,
          isWin: event.win,
          playerLosses: this.getPlayerLosses(this.playersService.getCurrentPlayerId()),
          enemyLosses: this.getPlayerLosses(this.playersService.getEnemyPlayer().id),
          struct: event.struct as NeutralCampStructure,
        };

        this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: fightEndsPopup });
      },

      [BattleEvent.Display_Reward_Popup]: event => {
        const struct = event.struct;

        const structReward = struct.reward;
        if (structReward) {
          switch (structReward.type) {
            case NeutralRewardTypesEnum.Resources:
              const structRewardPopup: StructRewardPopup = {
                type: PopupTypesEnum.StructResourcesReward,
                struct: struct,
              };

              this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structRewardPopup });
              break;

            case NeutralRewardTypesEnum.UnitsHire:
              const structHirePopup: StructHireRewardPopup = {
                type: PopupTypesEnum.HiringReward,
                struct: struct,
              }

              this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structHirePopup });
              break;
            case NeutralRewardTypesEnum.Item:
              const structItemRewardPopup: StructItemRewardPopup = {
                type: PopupTypesEnum.ItemReward,
                struct: struct,
              };

              this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structItemRewardPopup });
              
              break;
          }
        }
      },
    }).subscribe();
  }

  @WireEvent(BattleEvent.Display_Popup)
  public displayPopup(event: DisplayPopupEvent): void {
    this.popups.push(event.popup);
  }

  public removePopup(popupToRemove: PopupModel): void {
    this.popups = this.popups.filter(popup => popup !== popupToRemove);
  }

  private getPlayerLosses(playerId: string): LossModel[] {
    const playerLossesMap = this.battleState.playerLosses[playerId];

    return [...playerLossesMap].map(loss => ({ type: loss[0], count: loss[1] }));
  }

  ngOnInit(): void {
  }

}
