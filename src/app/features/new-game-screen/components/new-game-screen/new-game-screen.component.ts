import { Component, signal } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import {
  GameCreated,
  GameOpenMainScreen,
  ViewsEnum,
} from 'src/app/core/events';
import { Faction, Factions, humansFaction } from 'src/app/core/factions';
import { neutralsFaction } from 'src/app/core/factions/neutrals/faction';
import { HeroBase } from 'src/app/core/heroes';
import { PlayerTypeEnum } from 'src/app/core/players';
import { Town, TownBase } from 'src/app/core/towns';
import { CommonUtils } from 'src/app/core/utils';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { State } from 'src/app/features/services/state.service';
import { escapeToView } from 'src/app/features/services/utils/view.util';
import { EventsService } from 'src/app/store';

const nonPlayableFactions: Faction[] = [neutralsFaction];

interface PlayerItem {
  id: string;
  name: string;
  isMainPlayer?: true;
  controlType: PlayerTypeEnum;
  selectedFaction?: Faction;
  selectedHero?: HeroBase;
  pickedColor: PLAYER_COLORS;
}

@Component({
  selector: 'mw-new-game-screen',
  templateUrl: './new-game-screen.component.html',
  styleUrls: ['./new-game-screen.component.scss'],
})
export class NewGameScreenComponent {
  readonly players = signal<PlayerItem[]>([
    {
      id: '1',
      name: 'Player 1',
      isMainPlayer: true,
      selectedFaction: humansFaction,
      controlType: PlayerTypeEnum.Player,
      pickedColor: PLAYER_COLORS.BLUE,
      selectedHero: humansFaction.getAllHeroes().find(hero => hero.id === `#hero-helvetica`)
    },
    // {
    //   id: '2',
    //   name: 'Player 2',
    //   selectedFaction: humansFaction,
    //   controlType: PlayerTypeEnum.AI,
    //   pickedColor: PLAYER_COLORS.RED,
    // },
    // {
    //   id: '3',
    //   name: 'Player 3',
    //   controlType: PlayerTypeEnum.AI,
    //   selectedFaction: humansFaction,
    //   pickedColor: PLAYER_COLORS.GREEN,
    // },
  ]);

  public readonly playableFactions: Faction[] =
    Factions.getAllFactions().filter(
      (faction) => !nonPlayableFactions.includes(faction)
    );

  public hoveredHero?: HeroBase | null;
  public hoveredPlayer?: PlayerItem | null;

  controlTypes = PlayerTypeEnum;

  public readonly colors: PLAYER_COLORS[] = [
    PLAYER_COLORS.BLUE,
    PLAYER_COLORS.RED,
    PLAYER_COLORS.GREEN,
  ];

  constructor(
    private events: EventsService,
    private state: State,
    private gameObjectsManager: GameObjectsManager
  ) {
    escapeToView(ViewsEnum.MainScreen);
  }

  public startGame(): void {
    // todo: Multiple players, rework later
    const firstPlayer = this.players()[0];

    const faction =
      firstPlayer.selectedFaction ||
      CommonUtils.randItem(this.playableFactions);
    const townBase = faction.getTownBase() as TownBase<any>;

    this.state.createdGame = {
      faction,
      selectedColor: firstPlayer.pickedColor,
      selectedHero:
        firstPlayer.selectedHero || CommonUtils.randItem(faction.heroes),
      town: this.gameObjectsManager.createNewGameObject(Town, {
        townBase,
      }),
    };

    console.log(this.state.createdGame);

    this.events.dispatch(GameCreated());
  }

  public returnToMainScreen(): void {
    this.events.dispatch(GameOpenMainScreen());
  }

  selectFactionForPlayer(player: PlayerItem, faction?: Faction) {
    player.selectedFaction = faction;

    if (faction) {
      player.selectedHero = faction.getAllHeroes()[0];
    } else {
      player.selectedHero = undefined;
    }
  }

  toggleControlType(player: PlayerItem): void {
    if (player.isMainPlayer) {
      return;
    }

    player.controlType =
      player.controlType === PlayerTypeEnum.AI
        ? PlayerTypeEnum.Player
        : PlayerTypeEnum.AI;
  }
}
