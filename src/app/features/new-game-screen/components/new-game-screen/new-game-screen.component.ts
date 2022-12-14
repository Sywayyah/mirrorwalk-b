import { Component } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { Fraction, Fractions, humansFraction } from 'src/app/core/fractions';
import { HeroBase } from 'src/app/core/heroes';
import { Building, TownBase } from 'src/app/core/towns';
import { CommonUtils } from 'src/app/core/unit-types';
import { GameCreated, GameStart } from 'src/app/features/services/events';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

const nonPlayableFractions: Fraction<any>[] = [];
// const nonPlayableFractions: Fraction<any>[] = [neutralsFraction];

@Component({
  selector: 'mw-new-game-screen',
  templateUrl: './new-game-screen.component.html',
  styleUrls: ['./new-game-screen.component.scss']
})
export class NewGameScreenComponent {
  public playableFractions: Fraction<any>[] = Fractions
    .getAllFractions()
    .filter((fraction) => !nonPlayableFractions.includes(fraction));

  public heroes?: HeroBase[] | null = null;

  public selectedFraction?: Fraction<any>;

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
  ) {
    this.selectFraction(humansFraction);
  }

  public startGame(): void {
    const fraction = this.selectedFraction || CommonUtils.randItem(this.playableFractions);
    const townBase = fraction.getTownBase() as TownBase<any>;

    this.state.createdGame = {
      fraction,
      selectedColor: this.pickedColor,
      selectedHero: this.selectedHero || CommonUtils.randItem(this.heroes!),
      town: {
        base: townBase,
        buildings: Object.keys(townBase.availableBuildings).reduce((acc, buildingId) => {
          return {
            ...acc,
            [buildingId]: {
              currentLevel: 0,
              built: false,
              base: townBase.availableBuildings[buildingId],
              currentBuilding: townBase.availableBuildings[buildingId].levels[0].building,
            } as Building,
          }
        }, {}),
      },
    };

    console.log(this.state.createdGame);

    this.events.dispatch(GameCreated({}));
  }

  public goToMainScreen(): void {
    this.events.dispatch(GameStart({}));
  }

  public selectFraction(fraction?: Fraction<any>): void {
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
