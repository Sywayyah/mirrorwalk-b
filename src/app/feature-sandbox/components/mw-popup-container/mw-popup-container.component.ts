import { Component, OnInit } from '@angular/core';
import { NeutralCampStructure, NeutralRewardTypesEnum } from 'src/app/core/structures';
import { PopupModel, PopupTypesEnum, FightEndsPopup, StructRewardPopup, StructHireRewardPopup, StructItemRewardPopup, ScriptedRewardPopup, LossModel } from 'src/app/core/ui';
import { BattleStateService, MwPlayersService } from '../../services';
import { DisplayPopup, DisplayPopupEvent, DisplayReward, FightEnds, FightEndsEvent, NeutralStructParams } from '../../services/events';
import { StoreClient, WireMethod } from '../../services/store';

@Component({
  selector: 'mw-popup-container',
  templateUrl: './mw-popup-container.component.html',
  styleUrls: ['./mw-popup-container.component.scss']
})
export class MwPopupContainerComponent extends StoreClient() implements OnInit {

  public popups: PopupModel[] = [];
  public popupTypes: typeof PopupTypesEnum = PopupTypesEnum;

  constructor(
    private readonly battleState: BattleStateService,
    private readonly playersService: MwPlayersService,
  ) {
    super();
  }


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

    this.events.dispatch(DisplayPopup({
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

          this.events.dispatch(DisplayPopup({
            popup: structRewardPopup,
          }));
          break;

        case NeutralRewardTypesEnum.UnitsHire:
          const structHirePopup: StructHireRewardPopup = {
            type: PopupTypesEnum.HiringReward,
            struct: struct,
          }

          this.events.dispatch(DisplayPopup({
            popup: structHirePopup,
          }));
          break;
        case NeutralRewardTypesEnum.Item:
          const structItemRewardPopup: StructItemRewardPopup = {
            type: PopupTypesEnum.ItemReward,
            struct: struct,
          };

          this.events.dispatch(DisplayPopup({
            popup: structItemRewardPopup,
          }));

          break;

        case NeutralRewardTypesEnum.Scripted:
          const scriptedRewardPopup: ScriptedRewardPopup = {
            type: PopupTypesEnum.ScriptedReward,
            struct: struct,
          };

          this.events.dispatch(DisplayPopup({
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
