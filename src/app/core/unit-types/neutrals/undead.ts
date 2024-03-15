import { AssetsImages } from '../../assets';
import { neutralsFaction } from '../../factions/neutrals/faction';
import { FrightSpell } from '../../spells/common';
import { SkeletonsDamageBlock } from '../../spells/common/damage-block/skeletons-damage-block';
import { heroDescrElem } from '../../ui';
import { createStats } from '../utils';

neutralsFaction.defineUnitType({
  id: '#unit-neut-ghost-0',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Ghosts',
  level: 1,
  baseRequirements: {
    gold: 30,
  },

  getDescription(data) {
    return {
      descriptions: [
        heroDescrElem('Undead unit.'),
        heroDescrElem('<br>Possesses no outstanding qualities outside of low price and passive ability Fright. Gains improvements from Necromancy.'),
        heroDescrElem('<br>Can be upgraded into Wraiths, faster unit with better stats, inheriting Fright ability.'),
      ],
    }
  },

  getUnitTypeSpecialtyModifiers: (specialties) => {
    if (specialties.specialtyNecromancy > 1) {
      return { unitGroupSpeedBonus: 4, heroBonusDefence: 1 };
    }

    return null;
  },

  baseStats: createStats([[2, 3], 1, 2, 6, 8]),

  defaultSpells: [
    FrightSpell,
  ],
  neutralReward: {
    experience: 2.3,
    gold: 3,
  },
  upgradeDetails: {
    target: '#unit-neut-ghost-1',
    upgradeCost: {
      gold: 25,
    }
  },
  defaultModifiers: {
    isGhost: true,
  }
});

neutralsFaction.defineUnitType({
  id: '#unit-neut-ghost-1',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Wraiths',
  level: 1,
  baseRequirements: {
    gold: 55,
  },

  baseStats: createStats([[3, 3], 2, 4, 12, 12]),

  getDescription(data) {
    return {
      descriptions: [
        heroDescrElem('Undead unit. Upgraded and faster version of Ghosts.'),
        heroDescrElem('<br>While having increased stats, inherits passive ability Fright.'),
        heroDescrElem('<br>Gains improvements from Necromancy.'),
      ],
    }
  },

  getUnitTypeSpecialtyModifiers: (specialties) => {
    if (specialties.specialtyNecromancy === 1) {
      return { unitGroupSpeedBonus: 4, heroBonusDefence: 2 };
    }

    if (specialties.specialtyNecromancy >= 2) {
      return { unitGroupSpeedBonus: 4, heroBonusDefence: 2, resistCold: 10, resistFire: 10 };
    }

    return null;
  },

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

neutralsFaction.defineUnitType({
  id: '#unit-neut-skeleton-0',

  name: 'Skeletons',
  mainPortraitUrl: AssetsImages.UnitMelee,
  level: 1,

  getDescription() {
    return {
      descriptions: [
        heroDescrElem(`Undead unit.`),
        heroDescrElem(`Usually found in big numbers, Skeletons also have ability to block damage with some chance.`),
      ],
    }
  },

  baseStats: {
    damageInfo: { minDamage: 1, maxDamage: 2, },
    attackRating: 1,
    defence: 2,
    health: 9,
    speed: 11,

  },

  defaultSpells: [SkeletonsDamageBlock],

  baseRequirements: {
    gold: 55,
  },

  neutralReward: {
    experience: 3,
    gold: 2,
  },

});

neutralsFaction.defineUnitType({
  id: '#unit-neut-lich-0',

  name: 'Liches',
  mainPortraitUrl: AssetsImages.UnitMelee,
  level: 4,

  getDescription() {
    return {
      descriptions: [
        heroDescrElem(`Tier 4 Undead unit. Can be upgraded into Master Liches.`),
        heroDescrElem(`<br>Powerful undead creatures, standing in the head of undead armies. Masterful wielders of long swords, they also possess 25% lifesteal and cannot be slowed down.`),
      ],
    }
  },

  baseStats: {
    damageInfo: { minDamage: 13, maxDamage: 17, },
    attackRating: 6,
    defence: 5,
    health: 32,
    speed: 14,
  },

  defaultModifiers: {
    lifesteal: 25,
    isGhost: true,
    cannotBeSlowed: true,
  },

  baseRequirements: {
    gold: 400,
  },

  neutralReward: {
    experience: 30,
    gold: 2,
  },

  upgradeDetails: {
    target: '#unit-neut-lich-1',

    upgradeCost: {
      gold: 100
    },
  },

});

const MasterLich = neutralsFaction.defineUnitType({
  id: '#unit-neut-lich-1',

  name: 'Master Liches',
  mainPortraitUrl: AssetsImages.UnitMelee,
  level: 4,

  getDescription() {
    return {
      descriptions: [
        heroDescrElem(`Tier 4 Undead unit, an upgraded version of Liches.`),
        heroDescrElem(`<br>Powerful undead creatures, standing in the head of undead armies. Masterful wielders of long swords, they possess improved 45% lifesteal and cannot be slowed down.`),
      ],
    }
  },

  baseStats: {
    damageInfo: { minDamage: 14, maxDamage: 19, },
    attackRating: 7,
    defence: 7,
    health: 35,
    speed: 15,
  },

  defaultModifiers: {
    lifesteal: 45,
    isGhost: true,
    cannotBeSlowed: true,
  },

  baseRequirements: {
    gold: 400,
  },

  neutralReward: {
    experience: 40,
    gold: 2,
  },
});
