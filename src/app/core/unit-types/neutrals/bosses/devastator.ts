import { FireBreath } from 'src/app/core/spells/common/fire-breath';
import { heroDescrElem } from 'src/app/core/ui';
import { AssetsImages } from '../../../assets';
import { neutralsFraction } from '../../../fractions/neutrals/fraction';
import { simpleDescriptions } from '../../utils';

neutralsFraction.defineUnitType('Devastator', {
  name: 'Devastator',
  mainPortraitUrl: AssetsImages.UnitMelee,

  level: 8,

  getDescription: simpleDescriptions([
    heroDescrElem('An evil dragon of fire.'),
    heroDescrElem('<br>Dangerous boss unit with large health pool. Has +20% to All Resists and Fire Breath ability that damages random units.'),
  ]),

  baseStats: {
    damageInfo: { minDamage: 32, maxDamage: 47 },
    attackRating: 9,
    defence: 16,
    health: 900,
    speed: 14,
  },

  defaultSpells: [FireBreath],
  defaultModifiers: {
    isBoss: true,
    resistAll: 20,
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
