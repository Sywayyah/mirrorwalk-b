import { Injectable } from '@angular/core';
import { Fraction } from 'src/app/core/fractions';
import { HeroBase } from 'src/app/core/heroes';
import { defaultTravelPointsPerDay } from 'src/app/core/locations';
import { PlayerInstanceModel } from 'src/app/core/players';
import { Town } from 'src/app/core/towns';

/*
  I think I want to have state parts as separated features, maybe don't want to have all
  in one place

  or really only those that must be shared everywhere, like players, settings, etc.
*/
interface Feature {

}

interface GameState {
  day: number;
  travelPoints: number;
}

@Injectable({
  providedIn: 'root',
})
export class State {
  public createdGame!: {
    selectedHero: HeroBase;
    selectedColor: string;
    fraction: Fraction<any>;
    town: Town<any>;
  };

  public currentGame: GameState = {
    day: 1,
    travelPoints: defaultTravelPointsPerDay,
  };

  public settings: {} = {};

  public gameState!: {
    players: PlayerInstanceModel[];
    currentPlayer: PlayerInstanceModel;
    playersMap: Map<string, PlayerInstanceModel>;
  };

  /* State for when battle starts */
  public currentBattleState!: {
    currentPlayer: PlayerInstanceModel;
    enemyPlayer: PlayerInstanceModel;
  };
}
