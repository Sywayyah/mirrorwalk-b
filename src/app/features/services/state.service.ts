import { Injectable } from '@angular/core';
import { Faction } from 'src/app/core/factions';
import { HeroBase } from 'src/app/core/heroes';
import { Item } from 'src/app/core/items';
import { LevelMap } from 'src/app/core/maps';
import { ModsRefsGroup } from 'src/app/core/modifiers';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { FeatureState } from 'src/app/core/state';
import { MapStructure, defaultActionPointsPerDay } from 'src/app/core/structures';
import { Building, Town } from 'src/app/core/towns';
import { RefEventTriggersRegistry } from 'src/app/core/triggers';
import { UnitsOrientation } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';

/*
  I think I want to have state parts as separated features, maybe don't want to have all
  in one place

  or really only those that must be shared everywhere, like players, settings, etc.
*/

interface GameState {
  day: number;
  globalDay: number;
  week: number;
  actionPoints: number;
}

enum LossMode {
  // any losses during the fight are restored
  None,
  // losses during the fight are permanent
  Permanent,
}

type GameSettings = {
  goldGain?: number;
  experienceGain?: number;
  heroUnits?: boolean;
  neutralDamageFactor?: number;
  neutralHealthFactor?: number;

  lossToNeutrals?: LossMode;
  lossToPlayers?: LossMode;
  lossToNeutralPlayers?: LossMode;
};

@Injectable({
  providedIn: 'root',
})
export class State {
  readonly gameSettings = new FeatureState<GameSettings>({
    lossToNeutralPlayers: LossMode.Permanent,
    lossToPlayers: LossMode.Permanent,
    lossToNeutrals: LossMode.None,
  });

  public createdGame!: {
    selectedHero: HeroBase;
    selectedColor: string;
    faction: Faction;
    town: Town<string>;
  };

  public townsByPlayers = new Map<string, Town<string>>();

  public currentGame: GameState = {
    day: 1,
    globalDay: 1,
    week: 1,
    // maybe should be moved to player level..
    actionPoints: defaultActionPointsPerDay,
  };

  // todo: review map-related settings later
  public settings: {
    orientation: UnitsOrientation;
    mapDebug: boolean;
  } = {
    // Wire it to localStorage I suppose
    orientation: UnitsOrientation.Vertical,
    mapDebug: true,
  };

  public mainMenu: { isOpen?: boolean } = {};

  public gameState!: {
    players: Player[];
    currentPlayer: Player;
    playersMap: Map<string, Player>;
  };

  public mapsState!: {
    maps: LevelMap[];
    currentMap: LevelMap;
  };

  public mapCamera: { x: number; y: number; cameraInitialized: boolean } = {
    cameraInitialized: false,
    x: 0,
    y: 0,
  };

  /* State for when battle starts */
  public currentBattleState!: {
    currentPlayer: Player;
    enemyPlayer: Player;
  };

  // holds all spells initialized with combat handlers during the fight
  readonly initializedSpells = new FeatureState({ spells: [] as Spell[] });

  public eventHandlers: {
    items: RefEventTriggersRegistry<Item>;
    /* prepare events for structures and buildings */
    buildings: RefEventTriggersRegistry<Building>;
    structures: RefEventTriggersRegistry<MapStructure>;
  } = {
    items: new RefEventTriggersRegistry<Item>(),
    buildings: new RefEventTriggersRegistry<Building>(),
    structures: new RefEventTriggersRegistry<MapStructure>(),
  };

  public unitsAppliedModifiers: Map<UnitGroup, ModsRefsGroup> = new Map();
}
