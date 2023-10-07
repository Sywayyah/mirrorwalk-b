import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { FrightSpell } from '../../spells/common';
import { SkeletonsDamageBlock } from '../../spells/common/damage-block/skeletons-damage-block';
import { heroDescrElem } from '../../ui';
import { UnitBaseType } from '../types';
import { createStats } from '../utils';

/*
  Theoretically, I can set default values for some params when creating fraction.
  Also, there might be some batch creation, like 'defineUnitTypes'
 */
const Wraiths: UnitBaseType = neutralsFraction.defineUnitType('SupremeGhosts', {
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
        heroDescrElem('Undead unit. Upgraded version of Ghosts.'),
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

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

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

neutralsFraction.defineUnitType('Ghosts', {
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

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  defaultSpells: [
    FrightSpell,
  ],
  neutralReward: {
    experience: 2.3,
    gold: 3,
  },
  upgradeDetails: {
    target: Wraiths,
    upgradeCost: {
      gold: 25,
    }
  },
  defaultModifiers: {
    isGhost: true,
  }
});

neutralsFraction.defineUnitType('Skeletons', {
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

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  baseRequirements: {
    gold: 55,
  },

  neutralReward: {
    experience: 3,
    gold: 2,
  },

});
