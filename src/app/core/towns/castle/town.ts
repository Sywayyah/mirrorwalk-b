import { humansFraction } from '../../fractions';
import { ActivityTypes, Building, HiringActivity, TownBase } from '../types';


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


const townCenter: Building = {
  name: 'Town Center',
};

const market: Building = {
  name: 'Market',
};

const magicScool: Building = {
  name: 'Magic School',
};

const tavern: Building = {
  name: 'Tavern',
};

const trainingCamp: Building = {
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
  name: 'Archers Outpost',
};

const cavalryStalls = {
  name: 'Cavalry Stalls',
};

const magicTower: Building = {
  name: 'Magic Tower',
};

export const castleTownBase: TownBase<CastleTownBuildings> = {
  name: 'Castle',
  availableBuildings: {
    'town-center': {
      description: 'Grants you daily income',
      levels: [
        { building: townCenter, cost: { gold: 2000 } },
      ],
    },
    'market': {
      description: 'Allows to trade resources',
      levels: [
        { building: market, cost: { gold: 1500 } }
      ],
    },
    "magic-school": {
      description: 'Allows you to learn spells for your hero',
      levels: [
        { building: magicScool, cost: { gold: 1500, gems: 2 } }
      ],
    },
    'tavern': {
      description: 'Allows to hire neutral units',
      levels: [
        { building: tavern, cost: { gold: 1250 } },
      ],
    },
    'fate-halls': {
      description: 'Allows to develop your hero',
      levels: [
        { building: { name: 'Halls of Fate' }, cost: { gold: 100 } },
      ],
    },
    'training-camp': {
      description: 'Trains Pikemans',
      levels: [
        { building: trainingCamp, cost: { gold: 750 } }
      ],
    },
    'archers-outpost': {
      description: 'Trains Archers',
      levels: [
        { building: archersOutpost, cost: { gold: 1100 } },
      ],
    },
    'halls-of-knights': {
      description: 'Trains Knights',
      levels: [
        { building: hallsOfKnights, cost: { gold: 1200, wood: 3 } },
      ],
    },
    'cavalry-halls': {
      description: 'Trains Cavalry',
      levels: [
        { building: cavalryStalls, cost: { gold: 1500, wood: 4 } },
      ],
    },
    'magic-tower': {
      description: 'Trains Mystical Birds and Firebirds',
      levels: [
        { building: magicTower, cost: { gold: 2000, redCrystals: 2 } },
      ],
    },
  },
};

humansFraction.setTownBase(castleTownBase);
