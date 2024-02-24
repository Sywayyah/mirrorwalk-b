import { DevastatorScaleArmorDamageBlock } from 'src/app/core/spells/common/damage-block/devastator-damage-block';
import { FireBreath } from 'src/app/core/spells/common/fire-breath';
import { heroDescrElem } from 'src/app/core/ui';
import { AssetsImages } from '../../../assets';
import { neutralsFraction } from '../../../factions/neutrals/fraction';
import { simpleDescriptions } from '../../utils';

neutralsFraction.defineUnitType('Devastator', {
  id: '#ut-neut-boss-devastator',

  name: 'Devastator',
  mainPortraitUrl: AssetsImages.UnitMelee,

  level: 8,

  getDescription: simpleDescriptions([
    heroDescrElem('An evil dragon of fire.'),
    heroDescrElem('<br>Dangerous boss unit with large health pool. Resistant to magic, has +50% to Fire Resist and +20% to All Other Resists, also posseses Fire Breath ability that damages random enemies with fire.'),
    heroDescrElem('<br>His scales allow him to block some damage. Cannot be slowed.'),
  ]),

  baseStats: {
    damageInfo: { minDamage: 32, maxDamage: 47 },
    attackRating: 9,
    defence: 9,
    health: 820,
    speed: 14,
  },

  defaultSpells: [FireBreath, DevastatorScaleArmorDamageBlock],

  defaultModifiers: {
    isBoss: true,
    resistAll: 20,
    resistFire: 30,
    cannotBeSlowed: true,
  },

  baseRequirements: {},

  neutralReward: {
    experience: 120,
    gold: 340,
  },

  upgraded: false,
});
