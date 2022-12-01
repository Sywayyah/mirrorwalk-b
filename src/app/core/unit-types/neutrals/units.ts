import { AssetsImages } from '../../assets';
import { Fractions, FractionsEnum } from '../../fractions';
import { FrightSpell } from '../../spells/common';
import { UnitBase } from '../types';

type NEUTRAL_UNIT_TYPES =
  'Ghosts'
  | 'SupremeGhosts'
  | 'Gnoll'
  | 'Thiefs'
  | 'ForestTrolls'
  ;

const defaultReward = {
  gold: 0,
  experience: 0,
};

export const neutralsFraction = Fractions.createFraction<NEUTRAL_UNIT_TYPES>(FractionsEnum.Neutrals);

/*
  Theoretically, I can set default values for some params when creating fraction.
  Also, there might be some batch creation, like 'defineUnitTypes'
 */
const Wraiths: UnitBase = neutralsFraction.defineUnitType('SupremeGhosts', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Wraiths',
  level: 1,
  baseRequirements: {
    gold: 55,
  },
  baseStats: {
    damageInfo: {
      minDamage: 3,
      maxDamage: 3,
    },
    attackRating: 2,
    defence: 4,
    health: 12,
    speed: 12,
  },
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
  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 3,
    },
    attackRating: 1,
    defence: 2,
    health: 6,
    speed: 8,
  },
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
  baseStats: {
    damageInfo: {
      minDamage: 3,
      maxDamage: 4,
    },
    attackRating: 1,
    defence: 1,
    health: 10,
    speed: 12,
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
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Thiefs',
  level: 3,
  baseStats: {
    damageInfo: {
      minDamage: 6,
      maxDamage: 7,
    },
    attackRating: 2,
    defence: 1,
    health: 9,
    speed: 17,
  },

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

  baseStats: {
    damageInfo: {
      minDamage: 5,
      maxDamage: 7,
    },
    attackRating: 3,
    defence: 4,
    health: 13,
    speed: 10,
  },

  minQuantityPerStack: 2,
  defaultTurnsPerRound: 1,

  baseRequirements: {},
  neutralReward: {
    experience: 4,
    gold: 4.6,
  }
});
