import { Component, OnInit } from '@angular/core';
import { NeutralCampStructure, NeutralRewardTypesEnum } from "src/app/core/model/structures.types";
import { BattleEvent, BattleEventsService, BattleStateService, FightEndsPopup, LossModel, MwPlayersService, PopupModel, PopupTypesEnum, RoundEndsEvent, ScriptedRewardPopup, StructHireRewardPopup, StructItemRewardPopup, StructRewardPopup } from '../../services';
import { EventsService, StoreClient, WireMethod } from '../../services/state';
import { GameStoreClient } from '../../services/state-old/game-state.service';
import { WireEvent } from '../../services/state-old/store-decorators.config';
import { FightEnds } from '../../services/state-values/battle-events';
import { FightEndsEvent } from '../../services/state-values/battle.types';
import { DisplayPopup, DisplayPopupEvent, DisplayReward, FightStarts, NeutralStructParams } from '../../services/state-values/game-events';

@Component({
  selector: 'mw-popup-container',
  templateUrl: './mw-popup-container.component.html',
  styleUrls: ['./mw-popup-container.component.scss']
})
export class MwPopupContainerComponent extends StoreClient() implements OnInit {

  public popups: PopupModel[] = [];
  public popupTypes: typeof PopupTypesEnum = PopupTypesEnum;

  constructor(
    // private readonly battleEvents: BattleEventsService,
    private readonly battleState: BattleStateService,
    private readonly playersService: MwPlayersService,
    private newEvents: EventsService,
  ) {
    super();

    // this.battleEvents.onEvents({
    //   [BattleEvent.Fight_Ends]: (event: RoundEndsEvent) => {
    //     const fightEndsPopup: FightEndsPopup = {
    //       type: PopupTypesEnum.FightEnds,
    //       isWin: event.win,
    //       playerLosses: this.getPlayerLosses(this.playersService.getCurrentPlayerId()),
    //       enemyLosses: this.getPlayerLosses(this.playersService.getEnemyPlayer().id),
    //       struct: event.struct as NeutralCampStructure,
    //     };

    //     this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: fightEndsPopup });
    //   },

    //   [BattleEvent.Display_Reward_Popup]: event => {
    //     const struct = event.struct;

    //     const structReward = struct.reward;
    //     if (structReward) {
    //       switch (structReward.type) {
    //         case NeutralRewardTypesEnum.Resources:
    //           const structRewardPopup: StructRewardPopup = {
    //             type: PopupTypesEnum.StructResourcesReward,
    //             struct: struct,
    //           };

    //           this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structRewardPopup });
    //           break;

    //         case NeutralRewardTypesEnum.UnitsHire:
    //           const structHirePopup: StructHireRewardPopup = {
    //             type: PopupTypesEnum.HiringReward,
    //             struct: struct,
    //           }

    //           this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structHirePopup });
    //           break;
    //         case NeutralRewardTypesEnum.Item:
    //           const structItemRewardPopup: StructItemRewardPopup = {
    //             type: PopupTypesEnum.ItemReward,
    //             struct: struct,
    //           };

    //           this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structItemRewardPopup });

    //           break;

    //         case NeutralRewardTypesEnum.Scripted:
    //           const scriptedRewardPopup: ScriptedRewardPopup = {
    //             type: PopupTypesEnum.ScriptedReward,
    //             struct: struct,
    //           };

    //           this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: scriptedRewardPopup });

    //           break;
    //       }
    //     }
    //   },
    // }).subscribe();
  }

  // @WireEvent(BattleEvent.Display_Popup)
  // public displayPopup(event: DisplayPopupEvent): void {
  //   this.popups.push(event.popup);
  // }

  @WireMethod(DisplayPopup)
  public displayPopup(event: DisplayPopupEvent): void {
    this.popups.push(event.popup);
  }

  @WireMethod(FightEnds)
  public fightEndsPopup(event: FightEndsEvent): void {
    const fightEndsPopup: FightEndsPopup = {
      type: PopupTypesEnum.FightEnds,
      isWin: event.win,
      playerLosses: this.getPlayerLosses(this.playersService.getCurrentPlayerId()),
      enemyLosses: this.getPlayerLosses(this.playersService.getEnemyPlayer().id),
      struct: event.struct as NeutralCampStructure,
    };

    // this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: fightEndsPopup });
    this.newEvents.dispatch(DisplayPopup({
      popup: fightEndsPopup,
    }));
  }

  @WireMethod(DisplayReward)
  public displayRewardPopup(event: NeutralStructParams): void {
    const struct = event.struct;

    const structReward = struct.reward;
    if (structReward) {
      switch (structReward.type) {
        case NeutralRewardTypesEnum.Resources:
          const structRewardPopup: StructRewardPopup = {
            type: PopupTypesEnum.StructResourcesReward,
            struct: struct,
          };

          // this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structRewardPopup });
          this.newEvents.dispatch(DisplayPopup({
            popup: structRewardPopup,
          }));
          break;

        case NeutralRewardTypesEnum.UnitsHire:
          const structHirePopup: StructHireRewardPopup = {
            type: PopupTypesEnum.HiringReward,
            struct: struct,
          }

          // this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structHirePopup });
          this.newEvents.dispatch(DisplayPopup({
            popup: structHirePopup,
          }));
          break;
        case NeutralRewardTypesEnum.Item:
          const structItemRewardPopup: StructItemRewardPopup = {
            type: PopupTypesEnum.ItemReward,
            struct: struct,
          };

          // this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: structItemRewardPopup });
          this.newEvents.dispatch(DisplayPopup({
            popup: structItemRewardPopup,
          }));

          break;

        case NeutralRewardTypesEnum.Scripted:
          const scriptedRewardPopup: ScriptedRewardPopup = {
            type: PopupTypesEnum.ScriptedReward,
            struct: struct,
          };

          // this.battleEvents.dispatchEvent({ type: BattleEvent.Display_Popup, popup: scriptedRewardPopup });
          this.newEvents.dispatch(DisplayPopup({
            popup: scriptedRewardPopup,
          }));
          break;
      }
    }
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
