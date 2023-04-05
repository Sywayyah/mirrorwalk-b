import { AssetsImages } from '../../assets';
import { constellationFraction } from '../../fractions/constellation/fraction';

// Units of constellation might be more durable and slightly higher
// quality then average units

constellationFraction.defineUnitType('Sprite', {
  name: 'Sprite',
  level: 1,
  mainPortraitUrl: AssetsImages.Melee,

  baseRequirements: {
    gold: 70,
  },

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 3,
    },
    speed: 7,
    defence: 4,
    health: 14,
    attackRating: 4,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,
  neutralReward: {
    experience: 12,
    gold: 8,
  },
});

// block/retaliation mechanics
constellationFraction.defineUnitType('Fencer', {
  name: 'Fencer',
  level: 2,
  mainPortraitUrl: AssetsImages.Melee,

  baseRequirements: {
    gold: 75,
  },

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 4,
    },
    speed: 7,
    defence: 2,
    health: 13,
    attackRating: 5,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,
  neutralReward: {
    experience: 12,
    gold: 8,
  },
});

constellationFraction.defineUnitType('Sagittar', {
  name: 'Saggitar',
  level: 3,
  mainPortraitUrl: AssetsImages.Ranged,

  baseRequirements: {
    gold: 95,
  },

  defaultModifiers: {
    isRanged: true,
  },

  baseStats: {
    damageInfo: {
      minDamage: 6,
      maxDamage: 8,
    },
    speed: 17,
    defence: 4,
    health: 17,
    attackRating: 5,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,
  neutralReward: {
    experience: 18,
    gold: 14,
  },
})

// potential level 5
constellationFraction.defineUnitType('Chariot', {
  name: 'Chariot',
  level: 4,
  mainPortraitUrl: AssetsImages.Melee,

  baseRequirements: {
    gold: 185,
  },

  baseStats: {
    damageInfo: {
      minDamage: 15,
      maxDamage: 24,
    },
    speed: 24,
    defence: 8,
    health: 35,
    attackRating: 9,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,
  neutralReward: {
    experience: 18,
    gold: 14,
  },
});
