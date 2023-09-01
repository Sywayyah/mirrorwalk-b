import { FireBreath } from 'src/app/core/spells/common/fire-breath';
import { AssetsImages } from '../../../assets';
import { neutralsFraction } from '../../../fractions/neutrals/fraction';
import { createStats, simpleDescriptions } from '../../utils';
import { heroDescrElem } from 'src/app/core/ui';

neutralsFraction.defineUnitType('Devastator', {
  name: 'Devastator',
  mainPortraitUrl: AssetsImages.UnitMelee,

  level: 8,

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 8 unit, dragon of fire.'),
    heroDescrElem('<br>Dangerous boss unit with large health pool. Has +20% to All Resists and Fire Breath ability that damages random units.'),
  ]),

  baseStats: {
    damageInfo: { minDamage: 30, maxDamage: 45 },
    attackRating: 7,
    defence: 16,
    health: 900,
    speed: 13,
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
