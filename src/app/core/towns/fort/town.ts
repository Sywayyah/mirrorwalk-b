import { fortFraction } from '../../fractions';
import { BuidlingBase } from '../buildings';
import { TownBase } from '../types';
import { createHiringActivity } from '../utils';

export type CastleTownBuildings =
  | 'town-hall'

  | 'goblin-huts'
  | 'stockade'

  | 'market'

  | 'tavern';


const townCenter: BuidlingBase = {
  name: 'Town Hall',
  description: 'Earns 400 gold each day.',
  config: {
    init({ players, localEvents }) {
      localEvents.on({
        NewDayBegins() {
          players.giveResourcesToPlayer(players.getCurrentPlayer(), { gold: 400 });
        },
      })
    }
  }
};

const market: BuidlingBase = {
  name: 'Market',
};

const tavern: BuidlingBase = {
  name: 'Tavern',
};

const goblinHuts: BuidlingBase = {
  name: 'Goblin Huts',
  description: 'Allows to train Raiders that can be upgraded.',
  activity: createHiringActivity(fortFraction.getUnitType('Raiders'), 18, 'raiders'),
};

const upgradedGoblinHuts: BuidlingBase = {
  name: 'Upg. Goblin Huts',
  description: 'Allows to train Raiders and Clan.',
  activity: createHiringActivity(fortFraction.getUnitType('Raiders'), 18, 'raiders', true),
};

const stockade: BuidlingBase = {
  name: 'Stockade',
  description: 'Allows to train Goblin Archers that can be upgraded.',
  activity: createHiringActivity(fortFraction.getUnitType('GoblinArcher'), 18, 'goblinArcher'),
};

const upgradedStockade: BuidlingBase = {
  name: 'Upg. Stockade',
  description: 'Allows to train Goblin Archers and Goblin Shooters.',
  activity: createHiringActivity(fortFraction.getUnitType('GoblinArcher'), 18, 'goblinArcher', true),
};


// will be reworked, need somehow to process it in the fraction itself
export const factionTownBase: TownBase<CastleTownBuildings> = {
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

fortFraction.setTownBase(factionTownBase);
