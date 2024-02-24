import { CONSTELLATION_UNIT_TYPES, constellationFaction } from '../../factions/constellation/faction';
import { ActivityTypes, BuidlingBase, HiringActivity } from '../buildings';
import { TownBase } from '../types';
import { createBuildingType } from '../utils';


function createHiringActivity(
  unitType: CONSTELLATION_UNIT_TYPES,
  growth: number,
  unitGrowthGroup: string,
  upgrade: boolean = false,
): HiringActivity {
  return {
    type: ActivityTypes.Hiring,
    hiring: { type: constellationFaction.getUnitType(unitType), growth, refillDaysInterval: 7 },
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

const townCenter = createBuildingType({
  id: '#build-stellar-town-center-1',

  name: 'Town Center',
});

const market = createBuildingType({
  id: '#build-stellar-market',

  name: 'Market',
});

const highTower = createBuildingType({
  id: '#build-stellar-high-tower',

  name: 'High Tower',
});

const tavern = createBuildingType({
  id: '#build-stellar-tavern',

  name: 'Tavern',
});

const spiritTowers = createBuildingType({
  id: '#build-stellar-spirit-towers',
  name: 'Spirit Towers',
  description: 'Allows to train Sprites.',
  activity: createHiringActivity('Sprite', 10, 'sprite'),
});

const moonArch = createBuildingType({
  id: '#build-stellar-moon-arch-1',

  name: 'Moon Arch',
  activity: createHiringActivity('Sagittar', 8, 'saggitar'),
});

const hallsOfFate = createBuildingType({ id: '#build-stellar-fate-halls', name: 'Halls of Fate' });
export const castleTownBase: TownBase<ConstellationTownBuildings> = {
  id: '#town-constellation',
  name: 'Constellation',
  availableBuildings: {
    'town-center': {
      baseName: 'Town Center',
      description: 'Grants you daily income',
      levels: [
        { building: townCenter, cost: { gold: 2000 } },
      ],
      icon: 'capitol',
      tier: 1,
    },
    'market': {
      baseName: 'Market',
      description: 'Allows to trade resources',
      levels: [
        { building: market, cost: { gold: 1350 } }
      ],
      icon: 'gavel',
      tier: 1,
    },
    "magic-school": {
      baseName: 'Magic School',
      description: 'Allows you to learn spells for your hero',
      levels: [
        { building: highTower, cost: { gold: 1500, gems: 1 } }
      ],
      icon: 'burning-book',
      tier: 2,
    },
    'tavern': {
      baseName: 'Tavern',
      description: 'Allows to hire neutral units',
      levels: [
        { building: tavern, cost: { gold: 1250 } },
      ],
      icon: 'hood',
      tier: 2,
    },
    'fate-halls': {
      baseName: 'Halls of Fate',
      description: 'Allows to develop your hero',
      levels: [
        { building: hallsOfFate, cost: { gold: 1500 } },
      ],
      icon: 'barrier',
      tier: 2,
    },
    'spirit-towers': {
      baseName: 'Spirit Towers',
      description: 'Trains Sprites',
      levels: [
        { building: spiritTowers, cost: { gold: 450 } },
      ],
      icon: 'spear-head',
      tier: 1,
    },
    'moon-arch': {
      baseName: 'Moon Arch',
      description: 'Trains Sagittars',
      levels: [
        { building: moonArch, cost: { gold: 500, wood: 1 } },
      ],
      icon: 'arrow-cluster',
      tier: 1,
    },
  },
};

constellationFaction.setTownBase(castleTownBase);
