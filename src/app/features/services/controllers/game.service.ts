import { inject, Injectable } from '@angular/core';
import { ActionCardTypes } from 'src/app/core/action-cards';
import { PLAYER_COLORS } from 'src/app/core/assets';
import {
  ActivateActionCard,
  AddActionCardsToPlayer,
  BeforeBattleInit,
  DefaultGameModes,
  FightStarts,
  FightStartsEvent,
  GameCommandEvents,
  GameCreated,
  GameEventsTypes,
  GameOpenMainScreen,
  GameOpenMapStructuresScreen,
  GamePreparedEvent,
  GameStarted,
  NeutralStructParams,
  NewDayStarted,
  NewWeekStarted,
  OpenActiviesAndSpecialtiesDialog,
  PlayerLeavesTown,
  PlayersInitialized,
  PlayerStartsFight,
  PushEventFeedMessage,
  PushPlainEventFeedMessage,
  RemoveActionPoints,
  ScheduleAction,
  StructFightConfirmed,
  StructSelected,
  StructSelectedEvent,
  TestSandboxScenario,
  Triggers,
} from 'src/app/core/events';
import { Faction } from 'src/app/core/factions';
import { HeroBase, heroesDefaultResources } from 'src/app/core/heroes';
import { PlayerTypeEnum } from 'src/app/core/players';
import { StructEvents } from 'src/app/core/structures/events';
import { Town, TownBase, TownEvents } from 'src/app/core/towns';
import { DescriptionElementType } from 'src/app/core/ui';
import { CommonUtils } from 'src/app/core/utils';
import { infNum } from 'src/app/core/utils/common';
import { actionCardEvent } from 'src/app/core/vfx';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { ApiProvider } from '../api-provider.service';
import { BattleStateService } from '../mw-battle-state.service';
import { MwHeroesService } from '../mw-heroes.service';
import { MwPlayersService, PLAYER_IDS } from '../mw-players.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';
import { UiEventFeedService } from '../ui-event-feed.service';
import { GameObjectsManager } from '../game-objects-manager.service';

@Injectable()
export class GameController extends StoreClient() {
  private readonly battleState = inject(BattleStateService);
  private readonly structuresService = inject(MwStructuresService);
  private readonly players = inject(MwPlayersService);
  private readonly heroesService = inject(MwHeroesService);
  private readonly state = inject(State);
  private readonly eventFeedUiService = inject(UiEventFeedService);
  private readonly gameApiProvider = inject(ApiProvider);
  private readonly eventFeed = inject(UiEventFeedService);
  private readonly gameObjectsManager = inject(GameObjectsManager);

  private scheduledActions: { day: number; action: () => void }[] = [];

  @Notify(GameStarted)
  public openMainScreenOnGameStart(): void {
    this.events.dispatch(GameOpenMainScreen());
  }

  @WireMethod(Triggers.GamePreparationFinished)
  public initializeGameMap(event: GamePreparedEvent): void {
    this.state.mapsState = {
      currentMap: event.map,
      maps: [event.map],
    };
    this.structuresService.initStructures(event);

    // must occur every week
    this.events.dispatch(OpenActiviesAndSpecialtiesDialog());
  }

  @WireMethod(TestSandboxScenario)
  // todo: rework, revisit
  public testSandboxScenario(params: { hero: HeroBase; faction: Faction; townBase: TownBase<any> }): void {
    this.state.createdGame = {
      faction: params.faction,
      selectedColor: PLAYER_COLORS.BLUE,
      selectedHero: params.hero,
      town: this.gameObjectsManager.createNewGameObject(Town, {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        townBase: params.townBase,
      }),
    };
    const mainPlayer = this.players.createPlayer(
      PLAYER_IDS.Main,
      this.players.createPlayerWithHero(
        this.state.createdGame.selectedColor,
        this.state.createdGame.selectedHero,
        PlayerTypeEnum.Player,
      ),
    );

    const neutralPlayer = this.players.createPlayer(PLAYER_IDS.Neutral, {
      color: PLAYER_COLORS.GRAY,
      type: this.state.gameSettings.get().allowNeutralControl ? PlayerTypeEnum.Player : PlayerTypeEnum.AI,
      hero: this.heroesService.createNeutralHero(),
      resources: {
        ...heroesDefaultResources,
      },
    });

    mainPlayer.hero.assignOwnerPlayer(mainPlayer);
    neutralPlayer.hero.assignOwnerPlayer(neutralPlayer);

    mainPlayer.hero.unitGroups.forEach((unitGroup) => unitGroup.assignOwnerHero(mainPlayer.hero));
    neutralPlayer.hero.unitGroups.forEach((unitGroup) => unitGroup.assignOwnerHero(neutralPlayer.hero));

    this.state.gameState = {
      players: [mainPlayer, neutralPlayer],
      currentPlayer: mainPlayer,
      playersMap: new Map([
        [mainPlayer.id, mainPlayer],
        [neutralPlayer.id, neutralPlayer],
      ]),
    };

    this.events.dispatch(PlayersInitialized({}));
    this.events.dispatch(
      Triggers.PrepareGameEvent({
        gameMode: DefaultGameModes.SandboxScenario,
        selectedFaction: this.state.createdGame.faction,
      }),
    );
    this.events.dispatch(GameOpenMapStructuresScreen());
  }

  @Notify(GameCreated)
  public initPlayersOnGameStart(): void {
    const mainPlayer = this.players.createPlayer(
      PLAYER_IDS.Main,
      this.players.createPlayerWithHero(
        this.state.createdGame.selectedColor,
        this.state.createdGame.selectedHero,
        PlayerTypeEnum.Player,
      ),
    );

    const neutralPlayer = this.players.createPlayer(PLAYER_IDS.Neutral, {
      color: PLAYER_COLORS.GRAY,
      type: this.state.gameSettings.get().allowNeutralControl ? PlayerTypeEnum.Player : PlayerTypeEnum.AI,
      hero: this.heroesService.createNeutralHero(),
      resources: {
        ...heroesDefaultResources,
      },
    });

    mainPlayer.hero.assignOwnerPlayer(mainPlayer);
    neutralPlayer.hero.assignOwnerPlayer(neutralPlayer);

    mainPlayer.hero.unitGroups.forEach((unitGroup) => unitGroup.assignOwnerHero(mainPlayer.hero));
    neutralPlayer.hero.unitGroups.forEach((unitGroup) => unitGroup.assignOwnerHero(neutralPlayer.hero));

    this.state.gameState = {
      players: [mainPlayer, neutralPlayer],
      currentPlayer: mainPlayer,
      playersMap: new Map([
        [mainPlayer.id, mainPlayer],
        [neutralPlayer.id, neutralPlayer],
      ]),
    };

    this.events.dispatch(PlayersInitialized({}));
    this.events.dispatch(
      Triggers.PrepareGameEvent({ gameMode: DefaultGameModes.Normal, selectedFaction: this.state.createdGame.faction }),
    );
    this.events.dispatch(GameOpenMapStructuresScreen());
  }

  @Notify(NewDayStarted)
  public notifyBuildingsNewDayStarted(): void {
    this.state.eventHandlers.buildings.triggerAllHandlersByEvent(TownEvents.NewDayBegins());
    this.state.eventHandlers.structures.triggerAllHandlersByEvent(StructEvents.NewDayBegins());

    const currentGlobalDay = this.state.currentGame.globalDay;
    const currentDayActions = this.scheduledActions.filter((action) => action.day === currentGlobalDay);
    currentDayActions.forEach((action) => action.action());
    this.scheduledActions = this.scheduledActions.filter((action) => action.day !== currentGlobalDay);
  }

  @WireMethod(PushEventFeedMessage)
  public pushEventFeedMessage(event: GameCommandEvents['PushEventFeedMessage']): void {
    this.eventFeedUiService.pushEventFeedMessage(event);
  }

  @WireMethod(PushPlainEventFeedMessage)
  public pushPlainEventFeedMessage(event: GameCommandEvents['PushPlainEventFeedMessage']): void {
    this.eventFeedUiService.pushEventFeedMessage({
      message: [{ type: DescriptionElementType.FreeHtml, htmlContent: event.message }],
      delay: event.delay,
    });
  }

  @WireMethod(AddActionCardsToPlayer)
  public addActionCardsToPlayer(event: GameCommandEvents['AddActionCardsToPlayer']): void {
    this.eventFeedUiService.pushPlainMessage(
      `Received action cards:<hr> ${event.actionCardStacks
        .map(({ card, count }) => `x${infNum(count)} ${actionCardEvent(card)}`)
        .join('<br>')}`,
    );

    event.actionCardStacks.forEach(({ card, count }) => {
      event.player.addActionCards(card, count);
    });
  }

  @WireMethod(ActivateActionCard)
  public activateActionCard({ player, cardStack }: GameCommandEvents['ActivateActionCard']): void {
    console.log(cardStack);
    const card = cardStack.card;

    cardStack.count--;

    if (card.actionPoints) {
      this.events.dispatch(RemoveActionPoints({ points: card.actionPoints }));
    }

    if (!cardStack.count) {
      CommonUtils.removeItem(player.actionCards, cardStack);
    }

    this.eventFeed.pushPlainMessage(`${actionCardEvent(card)} is used. Left: ${infNum(cardStack.count)}`);

    if (card.type === ActionCardTypes.PlayerAction) {
      card.config?.onUsedInstantly?.(this.gameApiProvider.getGameApi());
    }
  }

  @WireMethod(NewWeekStarted)
  public notifyBuildignsNewWeekStarted(event: GameEventsTypes['NewWeekStarted']): void {
    this.eventFeedUiService.pushPlainMessage(`Week ${event.week} started`);
    this.state.eventHandlers.buildings.triggerAllHandlersByEvent(TownEvents.NewWeekStarts());
    this.state.eventHandlers.structures.triggerAllHandlersByEvent(StructEvents.NewWeekBegins());
  }

  @WireMethod(ScheduleAction)
  public scheduleAction(event: GameEventsTypes['ScheduleAction']): void {
    this.scheduledActions.push({ action: event.action, day: this.state.currentGame.globalDay + event.dayOffset });
  }

  @Notify(PlayerLeavesTown)
  public openMapScreenWhenPlayerLeavesTown(): void {
    this.events.dispatch(GameOpenMapStructuresScreen());
  }

  @WireMethod(StructFightConfirmed)
  public initFight(event: NeutralStructParams): void {
    this.state.currentBattleState = {
      currentPlayer: this.state.gameState.currentPlayer,
      // player should be defined, but it needs to be revisited later on
      enemyPlayer: event.struct.guardingPlayer!,
    };
  }

  @WireMethod(PlayerStartsFight)
  public fightStartInitQueue({ players, unitGroups }: FightStartsEvent): void {
    this.events.dispatch(BeforeBattleInit());

    this.battleState.initBattleState(unitGroups, players);

    this.events.dispatch(FightStarts({}));
  }

  @WireMethod(StructSelected)
  public onStructSelected(event: StructSelectedEvent): void {
    this.structuresService.currentStruct = event.struct;
  }
}
