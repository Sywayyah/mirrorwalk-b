import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { heroesDefaultResources } from 'src/app/core/heroes';
import { PlayerTypeEnum } from 'src/app/core/players';
import { DefaultGameModes, GamePreparedEvent, Triggers } from 'src/app/core/triggers';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { FightStarts, FightStartsEvent, GameCreated, NeutralStructParams, PlayerStartsFight, PlayersInitialized, StructFightConfirmed, StructSelected, StructSelectedEvent } from '../events';
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

  @WireMethod(Triggers.GamePreparationFinished)
  public initializeGameMap(event: GamePreparedEvent): void {
    this.structuresService.initStructures(event);
    this.state.mapsState = {
      currentMap: event.map,
      maps: [event.map],
      cameraPos: {
        x: 0,
        y: 0,
      }
    };
  }

  @Notify(GameCreated)
  public initPlayersOnGameStart(): void {
    /*
       For now, I can see some good overall tendency.

       There is a global store, source of truth, then there
       are some services, that interact with it and have some util
       methods.
     */
    const [mainPlayerId, mainPlayer] = this.players.createPlayerEntry(PLAYER_IDS.Main, this.players.createPlayerWithHero(
      this.state.createdGame.selectedColor,
      this.state.createdGame.selectedHero,
      PlayerTypeEnum.Player,
    ));

    const [neutralPlayerId, neutralPlayer] = this.players.createPlayerEntry(PLAYER_IDS.Neutral, {
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
        [mainPlayerId, mainPlayer],
        [neutralPlayerId, neutralPlayer],
      ]),
    };

    this.events.dispatch(PlayersInitialized({}));
    this.events.dispatch(Triggers.PrepareGameEvent({ gameMode: DefaultGameModes.Normal }));
  }

  @WireMethod(StructFightConfirmed)
  public initFight(event: NeutralStructParams): void {

    this.state.currentBattleState = {
      currentPlayer: this.state.gameState.currentPlayer,
      enemyPlayer: event.struct.guard,
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
