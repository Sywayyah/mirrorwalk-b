import { humansFraction } from '../../fractions';
import { ActivityTypes, BuidlingBase, HiringActivity, TownBase } from '../types';


export type CastleTownBuildings = 'town-center'
  | 'market'
  | 'magic-school'
  | 'fate-halls'
  | 'tavern'
  | 'training-camp'
  | 'archers-outpost'
  | 'halls-of-knights'
  | 'cavalry-halls'
  | 'magic-tower';


const townCenter: BuidlingBase = {
  name: 'Town Center',
};

const market: BuidlingBase = {
  name: 'Market',
};

const magicScool: BuidlingBase = {
  name: 'Magic School',
};

const tavern: BuidlingBase = {
  name: 'Tavern',
};

const trainingCamp: BuidlingBase = {
  name: 'Training Camp',
  activity: {
    type: ActivityTypes.Hiring,
    hiring: [
      { type: humansFraction.getUnitType('Pikeman'), count: 14, refillDaysInterval: 3 },
    ]
  } as HiringActivity,
};

const archersOutpost = {
  name: 'Archers Outpost',
};

const hallsOfKnights = {
  name: 'Halls of Knights',
};

const cavalryStalls = {
  name: 'Cavalry Stalls',
};

const magicTower: BuidlingBase = {
  name: 'Magic Tower',
};

// will be reworked, need somehow to process it in the fraction itself
export const castleTownBase: TownBase<CastleTownBuildings> = {
  name: 'Castle',
  availableBuildings: {
    'town-center': {
      description: 'Grants you daily income',
      levels: [
        { building: townCenter, cost: { gold: 2000 } },
      ],
      icon: 'capitol',
      tier: 1,
    },
    'market': {
      description: 'Allows to trade resources',
      levels: [
        { building: market, cost: { gold: 1500 } }
      ],
      icon: 'gavel',
      tier: 1,
    },
    "magic-school": {
      description: 'Allows you to learn spells for your hero',
      levels: [
        { building: magicScool, cost: { gold: 1500, gems: 2 } }
      ],
      icon: 'burning-book',
      tier: 2,
    },
    'tavern': {
      description: 'Allows to hire neutral units',
      levels: [
        { building: tavern, cost: { gold: 1250 } },
      ],
      icon: 'hood',
      tier: 2,
    },
    'fate-halls': {
      description: 'Allows to develop your hero',
      levels: [
        { building: { name: 'Halls of Fate' }, cost: { gold: 100 } },
      ],
      icon: 'barrier',
      tier: 2,
    },
    'training-camp': {
      description: 'Trains Pikemans',
      levels: [
        { building: trainingCamp, cost: { gold: 750 } }
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'archers-outpost': {
      description: 'Trains Archers',
      levels: [
        { building: archersOutpost, cost: { gold: 1100 } },
      ],
      icon: 'arrow-cluster',
      tier: 1,
    },
    'halls-of-knights': {
      description: 'Trains Knights',
      levels: [
        { building: hallsOfKnights, cost: { gold: 1200, wood: 3 } },
      ],
      icon: 'crossed-swords',
      tier: 2,
    },
    'cavalry-halls': {
      description: 'Trains Cavalry',
      levels: [
        { building: cavalryStalls, cost: { gold: 1500, wood: 4 } },
      ],
      icon: 'horseshoe',
      tier: 3,
    },
    'magic-tower': {
      description: 'Trains Mystical Birds and Firebirds',
      levels: [
        { building: magicTower, cost: { gold: 2000, redCrystals: 2 } },
      ],
      icon: 'tower',
      tier: 4,
    },
  },
};

humansFraction.setTownBase(castleTownBase);
