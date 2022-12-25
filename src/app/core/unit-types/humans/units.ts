import { AssetsImages } from '../../assets';
import { humansFraction } from '../../fractions/humans/fraction';
import { FirebirdHealSpell } from '../../spells/common';


const defaultRewards = {
  experience: 0,
  gold: 0,
};

const Halberdier = humansFraction.defineUnitType('Pikeman', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Harbeldier',
  level: 1,

  baseStats: {
    damageInfo: {
      minDamage: 3,
      maxDamage: 3,
    },
    attackRating: 2,
    defence: 3,
    health: 8,
    speed: 14,
  },
  defaultModifiers: {
    counterattacks: true,
  },
  minQuantityPerStack: 5,
  defaultTurnsPerRound: 1,

  baseRequirements: {
    gold: 75,
    redCrystals: 0,
  },
  neutralReward: defaultRewards,
});

const Pikeman = humansFraction.defineUnitType('Pikeman', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Pikemans',
  level: 1,

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 3,
    },
    attackRating: 2,
    defence: 2,
    health: 8,
    speed: 13,
  },
  defaultModifiers: {
    counterattacks: true,
  },
  minQuantityPerStack: 5,
  defaultTurnsPerRound: 1,

  upgradeDetails: {
    target: Halberdier,
    upgradeCost: {
      gold: 10,
    }
  },
  baseRequirements: {
    gold: 60,
    redCrystals: 0,
  },
  neutralReward: defaultRewards,
});

humansFraction.defineUnitType('Archer', {
  mainPortraitUrl: AssetsImages.Ranged,
  name: 'Archers',
  level: 2,

  baseStats: {
    damageInfo: {
      minDamage: 3,
      maxDamage: 4,
    },
    attackRating: 3,
    defence: 3,
    health: 8,
    speed: 21,
  },

  defaultModifiers: {
    isRanged: true,
  },

  minQuantityPerStack: 12,
  defaultTurnsPerRound: 2,

  baseRequirements: {
    gold: 95,
  },
  neutralReward: {
    experience: 2,
    gold: 2,
  },
});

humansFraction.defineUnitType('Knight', {
  mainPortraitUrl: AssetsImages.Melee,
  name: 'Knights',
  level: 3,

  baseStats: {
    damageInfo: {
      minDamage: 6,
      maxDamage: 9,
    },
    attackRating: 6,
    defence: 5,
    health: 17,
    speed: 10,
  },
  minQuantityPerStack: 2,
  defaultTurnsPerRound: 1,

  baseRequirements: {},
  neutralReward: defaultRewards,
});

humansFraction.defineUnitType('Cavalry', {
  name: 'Cavalry',
  mainPortraitUrl: AssetsImages.Melee,

  level: 4,

  baseStats: {
    damageInfo: {
      minDamage: 14,
      maxDamage: 18,
    },
    attackRating: 9,
    defence: 10,
    health: 31,
    speed: 12,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  baseRequirements: {
    gold: 175,
    wood: 1,
    // redCrystals: 1
  },
  neutralReward: {
    experience: 4,
    gold: 6.3,
  },
});

humansFraction.defineUnitType('Firebird', {
  name: 'Firebird',
  mainPortraitUrl: AssetsImages.Melee,

  level: 5,

  baseStats: {
    damageInfo: {
      minDamage: 21,
      maxDamage: 28,
    },
    attackRating: 11,
    defence: 12,
    health: 51,
    speed: 17,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  defaultSpells: [
    FirebirdHealSpell,
  ],

  baseRequirements: {
    gold: 400,
    wood: 1,
    // redCrystals: 1
  },
  neutralReward: {
    experience: 40,
    gold: 60,
  },
});
