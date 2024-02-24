import { Component } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { GameCreated, GameOpenMainScreen, ViewsEnum } from 'src/app/core/events';
import { Faction, Factions, humansFaction } from 'src/app/core/factions';
import { neutralsFaction } from 'src/app/core/factions/neutrals/fraction';
import { HeroBase } from 'src/app/core/heroes';
import { Town, TownBase } from 'src/app/core/towns';
import { CommonUtils } from 'src/app/core/utils';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { State } from 'src/app/features/services/state.service';
import { escapeToView } from 'src/app/features/services/utils/view.util';
import { EventsService } from 'src/app/store';

// const nonPlayableFractions: Fraction<any>[] = [];
const nonPlayableFractions: Faction<any>[] = [neutralsFaction];

@Component({
  selector: 'mw-new-game-screen',
  templateUrl: './new-game-screen.component.html',
  styleUrls: ['./new-game-screen.component.scss']
})
export class NewGameScreenComponent {
  public playableFractions: Faction<any>[] = Factions
    .getAllFactions()
    .filter((fraction) => !nonPlayableFractions.includes(fraction));

  public heroes?: HeroBase[] | null = null;

  public selectedFraction?: Faction<any>;

  public selectedHero: HeroBase | null = null;

  public pickedColor: string = PLAYER_COLORS.BLUE;

  public colors: string[] = [
    PLAYER_COLORS.BLUE,
    PLAYER_COLORS.RED,
    PLAYER_COLORS.GREEN,
  ];

  constructor(
    private events: EventsService,
    private state: State,
    private gameObjectsManager: GameObjectsManager,
  ) {
    this.selectFraction(humansFaction);
    escapeToView(ViewsEnum.MainScreen);
  }

  public startGame(): void {
    const fraction = this.selectedFraction || CommonUtils.randItem(this.playableFractions);
    const townBase = fraction.getTownBase() as TownBase<any>;

    this.state.createdGame = {
      fraction,
      selectedColor: this.pickedColor,
      selectedHero: this.selectedHero || CommonUtils.randItem(fraction.heroes),
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

  public selectFraction(fraction?: Faction<any>): void {
    this.selectedFraction = fraction;
    console.log(fraction);
    if (fraction) {
      this.heroes = fraction.getAllHeroes();
      this.selectedHero = this.heroes[0];
    } else {
      this.heroes = null;
      this.selectedHero = null;
    }
  }

  public selectHero(hero: HeroBase | null): void {
    this.selectedHero = hero;
  }

  public pickColor(color: string): void {
    this.pickedColor = color;
  }
}
