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

/*
  Buildings might be reworked

  levels, costs and labels per level might move under activities

  there will be no possibility to change building type,
  but it's unlikely that it will need to be changed.

  also, additional details for activity appear for activity

  and also buildings are going to be processed in some way
  at the moment of creation. For example, units growth map
  is going to be created from buildings with hiring activity
  type
*/
const trainingCamp: BuidlingBase = {
  name: 'Training Camp',
  activity: {
    type: ActivityTypes.Hiring,
    hiring: { type: humansFraction.getUnitType('Pikeman'), growth: 10, refillDaysInterval: 3 },
    unitGrowthGroup: 'pikeman',
    growth: 10,
    growthIntervalDays: 3,
  } as HiringActivity,
};

const upgradedTrainingCamp: BuidlingBase = {
  name: 'Upg. Training Camp',
  description: 'Allows to hire and upgrade Halberdiers',
  activity: {
    type: ActivityTypes.Hiring,
    hiring: { type: humansFraction.getUnitType('Pikeman'), growth: 10, refillDaysInterval: 3 },
    unitGrowthGroup: 'pikeman',
    growth: 10,
    growthIntervalDays: 3,
    upgrade: true,
  } as HiringActivity,
};

const archersOutpost = {
  name: 'Archers Outpost',
  activity: {
    type: ActivityTypes.Hiring,
    hiring: { type: humansFraction.getUnitType('Archer'), growth: 10, refillDaysInterval: 7 },
    unitGrowthGroup: 'archer',
    growth: 10,
    growthIntervalDays: 7,
  } as HiringActivity,
  // upgrade
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
        { building: { name: 'Halls of Fate' }, cost: { gold: 1000 } },
      ],
      icon: 'barrier',
      tier: 2,
    },
    'training-camp': {
      description: 'Trains Pikemans',
      levels: [
        { building: trainingCamp, cost: { gold: 600 } },
        { building: upgradedTrainingCamp, cost: { gold: 400, wood: 2 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'archers-outpost': {
      description: 'Trains Archers',
      levels: [
        { building: archersOutpost, cost: { gold: 800, wood: 1 } },
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
