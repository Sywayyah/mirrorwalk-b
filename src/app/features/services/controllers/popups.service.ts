import { Injectable } from '@angular/core';
import { NeutralCampStructure, NeutralRewardTypesEnum } from 'src/app/core/structures';
import { FightEndsPopup, LossModel } from 'src/app/core/ui';
import { StoreClient, WireMethod } from 'src/app/store';
import { HiringRewardPopupComponent, ItemRewardPopupComponent, PostFightRewardPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent } from '../../battleground/components';
import { PopupData, PopupService } from '../../shared/components';
import { DisplayPopup, DisplayReward, FightEnds, FightEndsEvent, NeutralStructParams } from '../events';
import { BattleStateService } from '../mw-battle-state.service';
import { MwPlayersService } from '../mw-players.service';


@Injectable()
export class PopupsController extends StoreClient() {

  constructor(
    private readonly popupService: PopupService,
    private readonly battleState: BattleStateService,
    private readonly playersService: MwPlayersService,
  ) {
    super();
  }

  @WireMethod(DisplayPopup)
  public displayPopup(event: PopupData): void {
    console.log('does it happen?')
    this.popupService.createPopup(event);
  }

  @WireMethod(FightEnds)
  public fightEndsPopup(event: FightEndsEvent): void {
    const fightEndsPopup: FightEndsPopup = {
      isWin: event.win,
      playerLosses: this.getPlayerLosses(this.playersService.getCurrentPlayerId()),
      enemyLosses: this.getPlayerLosses(this.playersService.getEnemyPlayer().id),
      struct: event.struct as NeutralCampStructure,
    };

    this.popupService.createPopup({
      popup: fightEndsPopup,
      component: PostFightRewardPopupComponent,
    });
  }

  @WireMethod(DisplayReward)
  public displayRewardPopup(event: NeutralStructParams): void {
    const struct = event.struct;

    const structReward = struct.reward;
    if (structReward) {
      switch (structReward.type) {
        case NeutralRewardTypesEnum.Resources:
          this.popupService.createBasicPopup({
            popup: { struct },
            component: ResourcesRewardPopupComponent,
          });

          break;
        case NeutralRewardTypesEnum.UnitsHire:
          this.popupService.createPopup({
            popup: {
              struct,
            },
            component: HiringRewardPopupComponent,
          });

          break;
        case NeutralRewardTypesEnum.Item:
          this.popupService.createPopup({
            popup: {
              struct,
            },
            component: ItemRewardPopupComponent,
          });

          break;
        case NeutralRewardTypesEnum.Scripted:
          this.popupService.createPopup({
            popup: {
              struct,
            },
            component: ScriptedRewardPopupComponent,
          });

          break;
      }
    }
  }

  private getPlayerLosses(playerId: string): LossModel[] {
    const playerLossesMap = this.battleState.playerLosses[playerId];

    return [...playerLossesMap].map(loss => ({ type: loss[0], count: loss[1] }));
  }
}
