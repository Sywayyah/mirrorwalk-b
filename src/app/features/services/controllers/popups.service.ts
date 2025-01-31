import { Dialog } from '@angular/cdk/dialog';
import { inject, Injectable, Type } from '@angular/core';
import { DisplayPlayerRewardAction, DisplayPlayerRewardPopup, DisplayPopup, DisplayReward, FightEnds, FightEndsEvent, GameEventsTypes, NeutralStructParams, OpenActiviesAndSpecialtiesDialog, OpenGarrisonPopup, OpenGlossary, OpenMainMenu, OpenSettings, OpenSplitUnitGroupPopup, OpenUnitSlotsActionPopup, PlayerOpensActionCards, PlayerOpensHeroInfo, ShowGameOverPopup, StructSelected, StructSelectedEvent } from 'src/app/core/events';
import { NeutralRewardTypesEnum, StructureType } from 'src/app/core/structures';
import { FightEndsPopup, LossModel, StructPopupData } from 'src/app/core/ui';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { HeroPopupComponent } from '../../battleground/components/hero-popup/hero-popup.component';
import { SettingsPopupComponent } from '../../main-screen/components';
import { HiringRewardPopupComponent, ItemRewardPopupComponent, PostFightRewardPopupComponent, PreFightPopupComponent, PreviewPopupComponent, ResourcesRewardPopupComponent, ScriptedRewardPopupComponent, UpgradeRewardPopupComponent } from '../../map-structures/components';
import { GameOverPopupComponent, MainMenuPopupComponent, PopupData, PopupService, RewardPopupComponent, SplitUnitsPopupComponent, UnitSlotsActionPopupComponent } from '../../shared/components';
import { ActionCardsPopupComponent } from '../../shared/components/action-cards-popup/action-cards-popup.component';
import { GlossaryComponent } from '../../shared/components/glossary/glossary.component';
import { WeekActivitiesDialogComponent } from '../../shared/components/week-activities-popup/week-activities-popup.component';
import { GarrisonPopupComponent } from '../../towns/components';
import { BattleStateService } from '../mw-battle-state.service';
import { MwPlayersService } from '../mw-players.service';


@Injectable()
export class PopupsController extends StoreClient() {
  private readonly dialog = inject(Dialog);

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

  @Notify(OpenActiviesAndSpecialtiesDialog)
  public openDialog(): void {
    // refactor cdk dialogs
    this.dialog.open(WeekActivitiesDialogComponent, {});
  }

  @Notify(PlayerOpensHeroInfo)
  public openHeroInfo(): void {
    this.popupService.createPopup({
      component: HeroPopupComponent,
      data: {},
      escape: true,
    });
  }

  @Notify(OpenSettings)
  public openSettings(): void {
    this.popupService.createBasicPopup({
      component: SettingsPopupComponent,
      data: {},
      escape: true,
    });
  }

  @Notify(OpenGlossary)
  openGlossary(): void {
    this.popupService.createBasicPopup({
      component: GlossaryComponent,
      data: {},
      escape: true,
      isCloseable: true,
    });
  }

  @Notify(OpenMainMenu)
  public openMainMenu(): void {
    this.popupService.createBasicPopup({
      component: MainMenuPopupComponent,
      data: {},
    });
  }

  @Notify(OpenGarrisonPopup)
  public openGarrison(): void {
    this.popupService.createBasicPopup({
      component: GarrisonPopupComponent,
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

  @WireMethod(OpenSplitUnitGroupPopup)
  public openUnitGroupSplitPopup(action: GameEventsTypes['OpenSplitUnitGroupPopup']): void {
    this.popupService.createBasicPopup({
      component: SplitUnitsPopupComponent,
      data: action,
    });
  }

  @WireMethod(OpenUnitSlotsActionPopup)
  public openUnitSlotsActionPopup(action: GameEventsTypes['OpenUnitSlotsActionPopup']): void {
    this.popupService.createBasicPopup({
      component: UnitSlotsActionPopupComponent,
      data: action,
    });
  }

  @Notify(PlayerOpensActionCards)
  public displayActionCardsPopup(): void {
    this.popupService.createBasicPopup({
      component: ActionCardsPopupComponent,
      data: {},
      class: 'transparent',
      isCloseable: true,
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
