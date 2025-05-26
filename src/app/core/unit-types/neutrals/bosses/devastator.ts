import { heroDescrElem } from 'src/app/core/ui';
import { AssetsImages } from '../../../assets';
import { neutralsFaction } from '../../../factions/neutrals/faction';
import { simpleDescriptions } from '../../utils';

neutralsFaction.defineUnitType({
  id: '#unit-neut-boss-devastator',

  name: 'Devastator',
  mainPortraitUrl: AssetsImages.UnitMelee,

  level: 8,

  getDescription: simpleDescriptions([
    heroDescrElem('An evil dragon of fire.'),
    heroDescrElem('<br>Dangerous boss unit with large health pool. Resistant to magic, has +50% to Fire Resist and +20% to All Other Resists, also posseses Fire Breath ability that damages random enemies with fire.'),
    heroDescrElem('<br>His scales allow him to block some damage. Cannot be slowed.'),
  ]),

  baseStats: {
    damageInfo: { minDamage: 66, maxDamage: 92 },
    attackRating: 9,
    defence: 9,
    health: 820,
    speed: 14,
  },

  defaultSpells: ['#spell-fire-breath', '#spell-devastator-block'],

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
