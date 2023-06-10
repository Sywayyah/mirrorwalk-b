import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { FrightSpell } from '../../spells/common';
import { UnitBaseType } from '../types';
import { createStats } from '../utils';

/*
  Theoretically, I can set default values for some params when creating fraction.
  Also, there might be some batch creation, like 'defineUnitTypes'
 */
const Wraiths: UnitBaseType = neutralsFraction.defineUnitType('SupremeGhosts', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Wraiths',
  level: 1,
  baseRequirements: {
    gold: 55,
  },

  baseStats: createStats([[3, 3], 2, 4, 12, 12]),

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  defaultSpells: [
    FrightSpell,
  ],

  defaultModifiers: {
    isGhost: true,
  },

  neutralReward: {
    experience: 2.3,
    gold: 2.4,
  },
  upgraded: true,
});

neutralsFraction.defineUnitType('Ghosts', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Ghosts',
  level: 1,
  baseRequirements: {
    gold: 30,
  },

  baseStats: createStats([[2, 3], 1, 2, 6, 8]),

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  defaultSpells: [
    FrightSpell,
  ],
  neutralReward: {
    experience: 2.3,
    gold: 2.4,
  },
  upgradeDetails: {
    target: Wraiths,
    upgradeCost: {
      gold: 25,
    }
  },
  defaultModifiers: {
    isGhost: true,
  }
});

neutralsFraction.defineUnitType('Gnoll', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Gnolls',
  level: 2,

  baseStats: createStats([[3, 4], 1, 1, 10, 12]),

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
  mainPortraitUrl: AssetsImages.Melee,
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
  mainPortraitUrl: AssetsImages.Melee,
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
