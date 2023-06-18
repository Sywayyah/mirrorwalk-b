import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { DefaultGameModes, FightStarts, FightStartsEvent, GameCreated, GameOpenMainScreen, GameOpenMapStructuresScreen, GamePreparedEvent, GameStarted, NeutralStructParams, PlayerLeavesTown, PlayerStartsFight, PlayersInitialized, StructFightConfirmed, StructSelected, StructSelectedEvent, Triggers } from 'src/app/core/events';
import { heroesDefaultResources } from 'src/app/core/heroes';
import { PlayerTypeEnum } from 'src/app/core/players';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { BattleStateService } from '../mw-battle-state.service';
import { MwHeroesService } from '../mw-heroes.service';
import { MwPlayersService, PLAYER_IDS } from '../mw-players.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';

@Injectable()
export class GameController extends StoreClient() {

  constructor(
    private battleState: BattleStateService,
    private structuresService: MwStructuresService,
    private players: MwPlayersService,
    private heroesService: MwHeroesService,
    private state: State,
  ) {
    super();
  }

  @Notify(GameStarted)
  public openMainScreenOnGameStart(): void {
    this.events.dispatch(GameOpenMainScreen());
  }

  @WireMethod(Triggers.GamePreparationFinished)
  public initializeGameMap(event: GamePreparedEvent): void {
    this.structuresService.initStructures(event);
    this.state.mapsState = {
      currentMap: event.map,
      maps: [event.map],
    };
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
      unitGroups: [],
      resources: {
        ...heroesDefaultResources,
      },
    });

    this.state.gameState = {
      players: [mainPlayer, neutralPlayer],
      currentPlayer: mainPlayer,
      playersMap: new Map([
        [mainPlayer.id, mainPlayer],
        [neutralPlayer.id, neutralPlayer],
      ]),
    };

    this.events.dispatch(PlayersInitialized({}));
    this.events.dispatch(Triggers.PrepareGameEvent({ gameMode: DefaultGameModes.Normal }));
    this.events.dispatch(GameOpenMapStructuresScreen());
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
    this.battleState.initBattleState(unitGroups, players);

    this.events.dispatch(FightStarts({}));
  }


  @WireMethod(StructSelected)
  public onStructSelected(event: StructSelectedEvent): void {
    this.structuresService.currentStruct = event.struct;
  }
}
