import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { AddActionCardsToPlayer, BeforeBattleInit, DefaultGameModes, FightStarts, FightStartsEvent, GameCommandEvents, GameCreated, GameEventsTypes, GameOpenMainScreen, GameOpenMapStructuresScreen, GamePreparedEvent, GameStarted, NeutralStructParams, NewDayStarted, NewWeekStarted, PlayerLeavesTown, PlayerStartsFight, PlayersInitialized, PushEventFeedMessage, PushPlainEventFeedMessage, StructFightConfirmed, StructSelected, StructSelectedEvent, Triggers } from 'src/app/core/events';
import { heroesDefaultResources } from 'src/app/core/heroes';
import { PlayerTypeEnum } from 'src/app/core/players';
import { StructEvents } from 'src/app/core/structures/events';
import { TownEvents } from 'src/app/core/towns';
import { DescriptionElementType } from 'src/app/core/ui';
import { actionCardEvent } from 'src/app/core/vfx';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { BattleStateService } from '../mw-battle-state.service';
import { MwHeroesService } from '../mw-heroes.service';
import { MwPlayersService, PLAYER_IDS } from '../mw-players.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';
import { UiEventFeedService } from '../ui-event-feed.service';
import { infNum } from 'src/app/core/utils/common';

@Injectable()
export class GameController extends StoreClient() {

  constructor(
    private battleState: BattleStateService,
    private structuresService: MwStructuresService,
    private players: MwPlayersService,
    private heroesService: MwHeroesService,
    private state: State,
    private eventFeedUiService: UiEventFeedService,
  ) {
    super();
  }

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
      type: PlayerTypeEnum.AI,
      hero: this.heroesService.createNeutralHero(),
      resources: {
        ...heroesDefaultResources,
      },
    });

    mainPlayer.hero.assignOwnerPlayer(mainPlayer);
    neutralPlayer.hero.assignOwnerPlayer(neutralPlayer);

    mainPlayer.hero.unitGroups.forEach(unitGroup => unitGroup.assignOwnerHero(mainPlayer.hero));
    neutralPlayer.hero.unitGroups.forEach(unitGroup => unitGroup.assignOwnerHero(neutralPlayer.hero));

    this.state.gameState = {
      players: [mainPlayer, neutralPlayer],
      currentPlayer: mainPlayer,
      playersMap: new Map([
        [mainPlayer.id, mainPlayer],
        [neutralPlayer.id, neutralPlayer],
      ]),
    };

    this.events.dispatch(PlayersInitialized({}));
    this.events.dispatch(Triggers.PrepareGameEvent({ gameMode: DefaultGameModes.Normal, selectedFaction: this.state.createdGame.faction }));
    this.events.dispatch(GameOpenMapStructuresScreen());
  }

  @Notify(NewDayStarted)
  public notifyBuildingsNewDayStarted(): void {
    this.state.eventHandlers.buildings.triggerAllHandlersByEvent(TownEvents.NewDayBegins());
    this.state.eventHandlers.structures.triggerAllHandlersByEvent(StructEvents.NewDayBegins());
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
    this.eventFeedUiService
      .pushPlainMessage(`Received action cards:<hr> ${event.actionCardStacks
        .map(({ card, count }) => `x${infNum(count)} ${actionCardEvent(card)}`)
        .join('<br>')}`
      );

    event.actionCardStacks.forEach(({ card, count }) => {
      event.player.addActionCards(card, count);
    });
  }

  @WireMethod(NewWeekStarted)
  public notifyBuildignsNewWeekStarted(event: GameEventsTypes['NewWeekStarted']): void {
    this.eventFeedUiService.pushPlainMessage(`Week ${event.week} started`);
    this.state.eventHandlers.buildings.triggerAllHandlersByEvent(TownEvents.NewWeekStarts());
    this.state.eventHandlers.structures.triggerAllHandlersByEvent(StructEvents.NewWeekBegins());
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
