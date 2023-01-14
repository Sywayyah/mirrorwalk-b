import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { heroesDefaultResources } from 'src/app/core/heroes';
import { PlayerTypeEnum } from 'src/app/core/players';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { FightStarts, FightStartsEvent, GameCreated, PlayersInitialized, PlayerStartsFight, StructFightConfirmed, StructSelected, StructSelectedEvent } from '../events';
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

  @Notify(GameCreated)
  public initPlayersOnGameStart(): void {
    const [mainPlayerId, mainPlayer] = this.players.createPlayerEntry(PLAYER_IDS.Main, this.players.createPlayerWithHero(
      this.state.createdGame.selectedColor,
      this.state.createdGame.selectedHero,
      PlayerTypeEnum.Player,
    ));

    this.players.players.set(mainPlayerId, mainPlayer);

    const [neutralPlayerId, neutralPlayer] = this.players.createPlayerEntry(PLAYER_IDS.Neutral, {
      color: PLAYER_COLORS.GRAY,
      type: PlayerTypeEnum.AI,
      hero: this.heroesService.createNeutralHero(),
      unitGroups: [],
      resources: {
        ...heroesDefaultResources,
      },
    });

    this.players.players.set(neutralPlayerId, neutralPlayer);

    this.state.gameState = {
      players: [mainPlayer, neutralPlayer],
    };

    this.events.dispatch(PlayersInitialized({}));
  }

  @Notify(StructFightConfirmed)
  public initFight(): void {

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
