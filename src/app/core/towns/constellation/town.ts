import { CONSTELLATION_UNIT_TYPES, constellationFraction } from '../../fractions/constellation/fraction';
import { ActivityTypes, BuidlingBase, HiringActivity, TownBase } from '../types';


function createHiringActivity(
  unitType: CONSTELLATION_UNIT_TYPES,
  growth: number,
  unitGrowthGroup: string,
  upgrade: boolean = false,
): HiringActivity {
  return {
    type: ActivityTypes.Hiring,
    hiring: { type: constellationFraction.getUnitType(unitType), growth, refillDaysInterval: 7 },
    unitGrowthGroup,
    growth,
    growthIntervalDays: 7,
    upgrade,
  } as HiringActivity;
}

export type ConstellationTownBuildings = 'town-center'
  | 'market'
  | 'magic-school'
  | 'fate-halls'
  | 'tavern'
  | 'spirit-towers'
  | 'moon-arch';

const townCenter: BuidlingBase = {
  name: 'Town Center',
};

const market: BuidlingBase = {
  name: 'Market',
};

const highTower: BuidlingBase = {
  name: 'High Tower',
};

const tavern: BuidlingBase = {
  name: 'Tavern',
};

const spiritTowers: BuidlingBase = {
  name: 'Spirit Towers',
  description: 'Allows to train Sprites.',
  activity: createHiringActivity('Sprite', 10, 'sprite'),
};

const moonArch = {
  name: 'Moon Arch',
  activity: createHiringActivity('Sagittar', 8, 'saggitar'),
};

export const castleTownBase: TownBase<ConstellationTownBuildings> = {
  name: 'Constellation',
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
        { building: market, cost: { gold: 1350 } }
      ],
      icon: 'gavel',
      tier: 1,
    },
    "magic-school": {
      description: 'Allows you to learn spells for your hero',
      levels: [
        { building: highTower, cost: { gold: 1500, gems: 1 } }
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
        { building: { name: 'Halls of Fate' }, cost: { gold: 1500 } },
      ],
      icon: 'barrier',
      tier: 2,
    },
    'spirit-towers': {
      description: 'Trains Sprites',
      levels: [
        { building: spiritTowers, cost: { gold: 450 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'moon-arch': {
      description: 'Trains Sagittars',
      levels: [
        { building: moonArch, cost: { gold: 500, wood: 1 } },
      ],
      icon: 'arrow-cluster',
      tier: 1,
    },
  },
};

constellationFraction.setTownBase(castleTownBase);
