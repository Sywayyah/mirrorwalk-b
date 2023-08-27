import { AssetsImages } from '../../assets';
import { humansFraction } from '../../fractions/humans/fraction';
import { FirebirdHealSpell } from '../../spells/common';
import { createStats } from '../utils';

const defaultRewards = {
  experience: 0,
  gold: 0,
};

const Halberdier = humansFraction.defineUnitType('Halberdier', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Harbeldier',
  level: 1,

  baseStats: createStats([[3, 3], 2, 3, 8, 14]),

  defaultModifiers: {
    counterattacks: true,
  },
  minQuantityPerStack: 5,
  defaultTurnsPerRound: 1,

  baseRequirements: {
    gold: 70,
    redCrystals: 0,
  },
  neutralReward: defaultRewards,
});

const Pikeman = humansFraction.defineUnitType('Pikeman', {
  name: 'Pikemans',
  level: 1,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 55,
  },

  defaultModifiers: {
    counterattacks: true,
  },

  baseStats: createStats([[2, 3], 2, 2, 8, 13]),

  upgradeDetails: {
    target: Halberdier,
    upgradeCost: {
      gold: 15,
    }
  },
  defaultTurnsPerRound: 1,
  minQuantityPerStack: 5,

  neutralReward: defaultRewards,
});

humansFraction.defineUnitType('Archer', {
  mainPortraitUrl: AssetsImages.UnitRanged,
  name: 'Archers',
  level: 2,

  // baseStats: {
  //   damageInfo: {
  //     minDamage: 3,
  //     maxDamage: 4,
  //   },
  //   attackRating: 1,
  //   defence: 3,
  //   health: 8,
  //   speed: 21,
  // },
  /*
    This might actually be a fun change. Archers might have two attacks and
    high base damage, but low attack rating. So, they might be less efficient
    against high defence unit types, but still have potential if their attack
    rating is invested into. There even might be some penalty, like archers
    are only getting 50% of additional attack rating. Some other units, on
    the other hand, might get increased bonus to attack rating, or something
    additional happening based on their attack rating.

    There also could be some modifiers that increase the efficiency of the
    attack itself. For now, attack is affecting damage basing on difference
    between attack and defence. If attack is higher than def, then damage
    will be increased by 5% per each point of difference, and reduced by 3%
    otherwise.

    These percent characteristics themselves might be affected somehow, for
    instance, if enemy has greater attack then knight's defence, then
    enemy will get not 5% bonus damage per each point of difference, but 3.5%.

    This could make Knights more efficient against units with high attack.

    Attack rating might even get negative (although, I'm not sure if it should
    affect damage in that case, or units might have attack rating penalty points,
    so if Archers have 5 attack rating penalty points, then player will need to
    increase their attack rating by at least 5, until any new points will have
    effect, only 6-th point will make difference).
  */

  baseStats: createStats([[3, 4], 1, 3, 8, 21]),

  defaultModifiers: {
    isRanged: true,
  },

  minQuantityPerStack: 12,
  defaultTurnsPerRound: 2,

  baseRequirements: {
    gold: 95,
  },
  neutralReward: {
    experience: 2,
    gold: 2,
  },
});

humansFraction.defineUnitType('Knight', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Knights',
  level: 3,

  baseStats: createStats([[6, 9], 6, 5, 17, 10]),

  minQuantityPerStack: 2,
  defaultTurnsPerRound: 1,

  baseRequirements: {
    gold: 100,
  },
  neutralReward: defaultRewards,
});

humansFraction.defineUnitType('Cavalry', {
  name: 'Cavalry',
  mainPortraitUrl: AssetsImages.UnitMelee,

  level: 4,

  baseStats: createStats([[14, 18], 9, 10, 31, 12]),

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  baseRequirements: {
    gold: 175,
    wood: 1,
    // redCrystals: 1
  },
  neutralReward: {
    experience: 4,
    gold: 6.3,
  },
});

humansFraction.defineUnitType('Firebird', {
  name: 'Firebird',
  mainPortraitUrl: AssetsImages.UnitMelee,

  level: 5,

  baseStats: createStats([[21, 28], 11, 12, 51, 17]),

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  defaultSpells: [
    FirebirdHealSpell,
  ],

  baseRequirements: {
    gold: 400,
    wood: 1,
    // redCrystals: 1
  },
  neutralReward: {
    experience: 40,
    gold: 60,
  },
});

// possible tier 4-6 unit: Monks, might increase your magical capabilities
// Knights could have a branching: Paladins, or something else

// Pikeman can give bonuses to some aura-like spells, like Valor.

// possible tier 7 for humans
//   fast, normal tier 7 stats
//   can deal lightning damage
// humansFraction.defineUnitType('Thunderer', {});
// humansFraction.defineUnitType('Valkyrie', {});
