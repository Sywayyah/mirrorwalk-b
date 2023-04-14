import { Injectable } from '@angular/core';
import { Fraction } from 'src/app/core/fractions';
import { HeroBase } from 'src/app/core/heroes';
import { ItemInstanceModel } from 'src/app/core/items';
import { defaultTravelPointsPerDay } from 'src/app/core/locations';
import { LevelMap } from 'src/app/core/maps';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellInstance } from 'src/app/core/spells';
import { Town } from 'src/app/core/towns';
import { RefEventTriggersRegistry } from 'src/app/core/triggers';
import { UnitsOrientation } from 'src/app/core/ui';

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

  // todo: review map-related settings later
  public settings: {
    orientation: UnitsOrientation,
    mapDebug: boolean,
  } = {
      // Wire it to localStorage I suppose
      orientation: UnitsOrientation.Vertical,
      mapDebug: true,
    };

  public gameState!: {
    players: PlayerInstanceModel[];
    currentPlayer: PlayerInstanceModel;
    playersMap: Map<string, PlayerInstanceModel>;
  };

  public mapsState!: {
    maps: LevelMap[];
    currentMap: LevelMap;
    cameraPos: { x: number; y: number; };
  }

  /* State for when battle starts */
  public currentBattleState!: {
    currentPlayer: PlayerInstanceModel;
    enemyPlayer: PlayerInstanceModel;
  };

  public eventHandlers: {
    spells: RefEventTriggersRegistry<SpellInstance>,
    items: RefEventTriggersRegistry<ItemInstanceModel>,
  } = {
      spells: new RefEventTriggersRegistry<SpellInstance>(),
      items: new RefEventTriggersRegistry<ItemInstanceModel>(),
    };
}
