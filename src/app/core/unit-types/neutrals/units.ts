import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { createStats } from '../utils';

neutralsFraction.defineUnitType('Gnoll', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Gnolls',
  level: 2,

  baseStats: createStats([[3, 4], 1, 1, 10, 12]),

  defaultModifiers: {
    resistFire: 10,
  },
  minQuantityPerStack: 5,
  defaultTurnsPerRound: 1,

  baseRequirements: {
    gold: 100,
    redCrystals: 0,
  },

  neutralReward: {
    experience: 3.3,
    gold: 2.8
  },
});

neutralsFraction.defineUnitType('Thiefs', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Thiefs',
  level: 3,

  baseStats: createStats([[6, 7], 2, 1, 9, 17]),

  minQuantityPerStack: 4,
  defaultTurnsPerRound: 2,

  baseRequirements: {},
  neutralReward: {
    experience: 4.55,
    gold: 3.9
  }
});

neutralsFraction.defineUnitType('ForestTrolls', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Trolls',
  level: 4,

  baseStats: createStats([[5, 7], 3, 4, 13, 10]),

  minQuantityPerStack: 2,
  defaultTurnsPerRound: 1,

  baseRequirements: {},
  neutralReward: {
    experience: 4,
    gold: 4.6,
  }
});
