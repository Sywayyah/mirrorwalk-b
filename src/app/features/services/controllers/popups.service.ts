import { Injectable, Type } from '@angular/core';
import { DisplayPlayerRewardAction, DisplayPlayerRewardPopup, DisplayPopup, DisplayReward, FightEnds, FightEndsEvent, NeutralStructParams, OpenSettings, PlayerOpensHeroInfo, ShowGameOverPopup, StructSelected, StructSelectedEvent } from 'src/app/core/events';
import { NeutralRewardTypesEnum, StructureType } from 'src/app/core/structures';
import { FightEndsPopup, LossModel, StructPopupData } from 'src/app/core/ui';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { HiringRewardPopupComponent, ItemRewardPopupComponent, PostFightRewardPopupComponent, PreFightPopupComponent, PreviewPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent, UpgradeRewardPopupComponent } from '../../battleground/components';
import { HeroPopupComponent } from '../../battleground/components/hero-popup/hero-popup.component';
import { SettingsPopupComponent } from '../../main-screen/components';
import { GameOverPopupComponent, PopupData, PopupService, RewardPopupComponent } from '../../shared/components';
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
    this.popupService.createPopup(event);
  }

  @Notify(PlayerOpensHeroInfo)
  public openHeroInfo(): void {
    this.popupService.createPopup({
      component: HeroPopupComponent,
      data: {},
    })
  }

  @Notify(OpenSettings)
  public openSettings(): void {
    this.popupService.createBasicPopup({
      component: SettingsPopupComponent,
      data: {},
    });
  }

  @Notify(ShowGameOverPopup)
  public showGameOverPopup(): void {
    this.popupService.createBasicPopup({
      component: GameOverPopupComponent,
      data: {},
    });
  }

  @WireMethod(DisplayPlayerRewardPopup)
  public displayPlayerRewardPopup(action: DisplayPlayerRewardAction): void {
    this.popupService.createBasicPopup({
      component: RewardPopupComponent,
      data: action,
    });
  }

  @WireMethod(StructSelected)
  public playerSelectsStructure(event: StructSelectedEvent): void {
    if (event.struct.guard?.length) {
      const prefightPopup: StructPopupData = {
        struct: event.struct,
      };

      this.events.dispatch(DisplayPopup({
        component: PreFightPopupComponent,
        data: prefightPopup
      }));

      return;
    }

    if (!event.struct.guard?.length) {

      if (event.struct.generator?.onVisited || event.struct.generator?.type === StructureType.Scripted) {
        const previewPopup: StructPopupData = {
          struct: event.struct,
        };

        this.events.dispatch(DisplayPopup({
          component: PreviewPopupComponent,
          data: previewPopup
        }));

        return;
      }

      const upgradingPopup: StructPopupData = {
        struct: event.struct,
      };

      this.events.dispatch(DisplayPopup({
        component: UpgradeRewardPopupComponent,
        data: upgradingPopup,
      }));

    }
  }

  @WireMethod(FightEnds)
  public fightEndsPopup(event: FightEndsEvent): void {
    const fightEndsPopup: FightEndsPopup = {
      isWin: event.win,
      playerLosses: this.getPlayerLosses(this.playersService.getCurrentPlayerId()),
      enemyLosses: this.getPlayerLosses(this.playersService.getEnemyPlayer().id),
      struct: event.struct,
    };

    this.popupService.createPopup({
      data: fightEndsPopup,
      component: PostFightRewardPopupComponent,
    });
  }

  @WireMethod(DisplayReward)
  public displayRewardPopup(event: NeutralStructParams): void {
    const struct = event.struct;

    const data = { struct };

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
          data,
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
