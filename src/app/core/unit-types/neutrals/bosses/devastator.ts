import { FireBreath } from 'src/app/core/spells/common/fire-breath';
import { AssetsImages } from '../../../assets';
import { neutralsFraction } from '../../../fractions/neutrals/fraction';
import { createStats } from '../../utils';

neutralsFraction.defineUnitType('Devastator', {
  name: 'Devastator',
  mainPortraitUrl: AssetsImages.UnitMelee,

  // Add units descriptions at some point
  level: 8,

  baseStats: createStats([[30, 40], 6, 16, 900, 13]),

  defaultSpells: [FireBreath],
  defaultModifiers: {
    isBoss: true,
    // check resists later
    resistAll: 10,
  },

  baseRequirements: {},
  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  neutralReward: {
    experience: 100,
    gold: 250,
  },

  upgraded: false,
});
