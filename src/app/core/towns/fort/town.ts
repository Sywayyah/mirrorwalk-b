import { resolveEntity } from '../../entities';
import { fortFaction } from '../../factions';
import { ActivityTypes, BuidlingBase } from '../buildings';
import { TownBase } from '../types';
import { createBuildingType, createHiringActivity } from '../utils';

export type CastleTownBuildings =
  | 'town-hall'

  | 'goblin-huts'
  | 'stockade'
  | 'rocky-caves'

  | 'market'

  | 'tavern';


const townCenter: BuidlingBase = createBuildingType({
  id: '#build-fort-town-hall-1',

  name: 'Town Hall',
  description: 'Earns 400 gold each day and gives 1 additional reserve slot.',
  config: {
    init({ players, localEvents }) {
      localEvents.on({
        NewDayBegins() {
          players.giveResourcesToPlayer(players.getCurrentPlayer(), { gold: 400 });
        },
        Built() {
          players.getCurrentPlayer().hero.addReserveSlots(1);
        }
      })
    }
  }
});

const market: BuidlingBase = createBuildingType({
  id: '#build-fort-market',
  name: 'Market',
});

const tavern: BuidlingBase = createBuildingType({
  id: '#build-fort-tavern',
  name: 'Tavern',
});

const rockyCaves = createBuildingType({
  id: '#build-fort-rocky-caves',
  name: 'Rocky Caves',
  description: 'Allows to hire units temporarily',
  activity: { type: ActivityTypes.Garrison },
  config: {
    init({ localEvents, players }) {
      localEvents.on({
        Built() {
          const currentPlayer = players.getCurrentPlayer();
          currentPlayer.garrisons.set('rocky-caves', {
            groups: [
              { cost: { gold: 100 }, count: 8, type: resolveEntity('#unit-f00') },
              { cost: { gold: 100 }, count: 8, type: resolveEntity('#unit-f00') },
              { cost: { gold: 100 }, count: 8, type: resolveEntity('#unit-f00') },
            ], name: 'Rocky Caves'
          });
        }
      });
    }
  },
});

const goblinHuts: BuidlingBase = createBuildingType({
  id: '#build-fort-goblin-huts-1',
  name: 'Goblin Huts',
  description: 'Allows to train Raiders that can be upgraded.',
  activity: createHiringActivity('#unit-f00', 18, 'raiders'),
});

const upgradedGoblinHuts = createBuildingType({
  id: '#build-fort-goblin-huts-2',
  name: 'Upg. Goblin Huts',
  description: 'Allows to train Raiders and Clan.',
  activity: createHiringActivity('#unit-f00', 18, 'raiders', true),
});

const stockade = createBuildingType({
  id: '#build-fort-stockade-1',
  name: 'Stockade',
  description: 'Allows to train Goblin Archers that can be upgraded.',
  activity: createHiringActivity('#unit-f10', 18, 'goblinArcher'),
});

const upgradedStockade = createBuildingType({
  id: '#build-fort-stockade-2',
  name: 'Upg. Stockade',
  description: 'Allows to train Goblin Archers and Goblin Shooters.',
  activity: createHiringActivity('#unit-f10', 18, 'goblinArcher', true),
});


// will be reworked, need somehow to process it in the faction itself
export const factionTownBase: TownBase<CastleTownBuildings> = {
  id: '#town-fort',
  name: 'Castle',
  availableBuildings: {
    'town-hall': {
      baseName: 'Town Hall',
      description: 'Grants you daily income',
      levels: [
        { building: townCenter, cost: { gold: 1000 } },
      ],
      icon: 'capitol',
      tier: 1,
    },
    'market': {
      baseName: 'Market',
      description: 'Allows to trade resources',
      levels: [
        { building: market, cost: { gold: 1500, wood: 2 } }
      ],
      icon: 'gavel',
      tier: 1,
    },
    "rocky-caves": {
      baseName: 'Rocky Caves',
      description: 'Allows to hire units temporarily',
      icon: 'guarded-tower',
      levels: [{ building: rockyCaves, cost: { gold: 200, wood: 2 } }],
      tier: 1,
    },
    'tavern': {
      baseName: 'Tavern',
      description: 'Allows to hire neutral units',
      levels: [
        { building: tavern, cost: { gold: 1250, wood: 3 } },
      ],
      icon: 'hood',
      tier: 2,
    },

    'goblin-huts': {
      baseName: 'Golbin Huts',
      description: 'Trains Goblin Huts',
      levels: [
        { building: goblinHuts, cost: { gold: 475 } },
        { building: upgradedGoblinHuts, cost: { gold: 150, wood: 2 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'stockade': {
      baseName: 'Stockade',
      description: 'Trains Goblin Archers',
      levels: [
        { building: stockade, cost: { gold: 700 } },
        { building: upgradedStockade, cost: { gold: 150, wood: 2 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
  },
};

fortFaction.setTownBase(factionTownBase);
