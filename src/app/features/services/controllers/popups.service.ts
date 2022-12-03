import { Injectable, Type } from '@angular/core';
import { NeutralCampStructure, NeutralRewardTypesEnum, NeutralSite, StructureTypeEnum } from 'src/app/core/structures';
import { FightEndsPopup, LossModel, PrefightPopup, PreviewPopup, UpgradingPopup } from 'src/app/core/ui';
import { StoreClient, WireMethod } from 'src/app/store';
import { HiringRewardPopupComponent, ItemRewardPopupComponent, PostFightRewardPopupComponent, PreFightPopupComponent, PreviewPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent, UpgradeRewardPopup } from '../../battleground/components';
import { PopupData, PopupService } from '../../shared/components';
import { DisplayPopup, DisplayReward, FightEnds, FightEndsEvent, NeutralStructParams, StructSelected, StructSelectedEvent } from '../events';
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


  @WireMethod(StructSelected)
  public playerSelectsStructure(event: StructSelectedEvent): void {
    if (event.struct.type === StructureTypeEnum.NeutralCamp) {
      const prefightPopup: PrefightPopup = {
        struct: event.struct as NeutralCampStructure,
      };


      this.events.dispatch(DisplayPopup({
        component: PreFightPopupComponent,
        popup: prefightPopup
      }));
      return;
    }

    if (event.struct.type === StructureTypeEnum.NeutralSite) {
      if (event.struct.generator.onVisited) {
        const previewPopup: PreviewPopup = {
          struct: event.struct as NeutralSite,
        };

        this.events.dispatch(DisplayPopup({
          component: PreviewPopupComponent,
          popup: previewPopup
        }));

        return;
      }

      const upgradingPopup: UpgradingPopup = {
        struct: event.struct as NeutralSite,
      };

      this.events.dispatch(DisplayPopup({
        component: UpgradeRewardPopup,
        popup: upgradingPopup,
      }));

    }
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

    const popup = { struct };

    const structReward = struct.reward;

    if (structReward) {
      const rewardComponentsMapping: Record<string, Type<any>> = {
        [NeutralRewardTypesEnum.Resources]: ResourcesRewardPopupComponent,
        [NeutralRewardTypesEnum.UnitsHire]: HiringRewardPopupComponent,
        [NeutralRewardTypesEnum.Item]: ItemRewardPopupComponent,
        [NeutralRewardTypesEnum.Scripted]: ScriptedRewardPopupComponent,
      };

      const rewardType = structReward.type;

      if (rewardType in rewardComponentsMapping) {
        const component = rewardComponentsMapping[rewardType];

        this.popupService.createBasicPopup({
          popup,
          component,
        });
      }
    }
  }

  private getPlayerLosses(playerId: string): LossModel[] {
    const playerLossesMap = this.battleState.playerLosses[playerId];

    return [...playerLossesMap].map(loss => ({ type: loss[0], count: loss[1] }));
  }
}
