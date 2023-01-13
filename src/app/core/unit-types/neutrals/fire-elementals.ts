import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';


neutralsFraction.defineUnitType('FireElemental', {
  name: 'Fire Elementals',
  mainPortraitUrl: AssetsImages.Melee,
  baseRequirements: {},
  baseStats: {
    attackRating: 3,
    damageInfo: {
      minDamage: 9,
      maxDamage: 13,
    },
    defence: 3,
    health: 17,
    speed: 18,
  },
  neutralReward: {
    experience: 10,
    gold: 15,
  },
  defaultSpells: [],
  defaultTurnsPerRound: 1,
  level: 3,
  minQuantityPerStack: 2,
})
