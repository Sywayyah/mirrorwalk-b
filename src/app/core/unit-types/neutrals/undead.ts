import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { FrightSpell } from '../../spells/common';
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
        heroDescrElem('Tier 1 Undead unit. Upgraded version of Ghosts. While having medium stats, inherits passive ability Fright. Gains improvements from Necromancy.'),
      ],
    }
  },

  getUnitTypeSpecialtyModifiers: (specialties) => {
    if (specialties.specialtyNecromancy === 1) {
      return { unitGroupSpeedBonus: 4, playerBonusDefence: 2 };
    }

    if (specialties.specialtyNecromancy > 2) {
      return { unitGroupSpeedBonus: 4, playerBonusDefence: 2, resistCold: 10, resistFire: 10 };
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
        heroDescrElem('Tier 1 Undead unit. Possesses no outstanding qualities outside of low price and passive ability Fright. Gains improvements from Necromancy.'),
        heroDescrElem('<br>Can be upgraded into Wraiths, faster unit with better stats, inheriting Fright ability.'),
      ],
    }
  },

  getUnitTypeSpecialtyModifiers: (specialties) => {
    if (specialties.specialtyNecromancy > 1) {
      return { unitGroupSpeedBonus: 4, playerBonusDefence: 1 };
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
    gold: 2.4,
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
