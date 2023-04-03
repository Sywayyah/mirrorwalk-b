import { AssetsImages } from '../../assets';
import { constellationFraction } from '../../fractions/constellation/fraction';


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

constellationFraction.defineUnitType('Sagittar', {
  name: 'Saggitar',
  level: 2,
  mainPortraitUrl: AssetsImages.Ranged,

  baseRequirements: {
    gold: 75,
  },

  defaultModifiers: {
    isRanged: true,
  },

  baseStats: {
    damageInfo: {
      minDamage: 4,
      maxDamage: 6,
    },
    speed: 16,
    defence: 4,
    health: 15,
    attackRating: 5,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,
  neutralReward: {
    experience: 18,
    gold: 14,
  },
});
