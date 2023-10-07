import { AssetsImages } from '../../assets';
import { humansFraction } from '../../fractions/humans/fraction';
import { FirebirdHealSpell } from '../../spells/common';
import { KnightsDamageBlock } from '../../spells/common/damage-block/knights-damage-block';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';

const defaultRewards = {
  experience: 0,
  gold: 0,
};

const Halberdier = humansFraction.defineUnitType('Halberdier', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Halberdier',
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

const Pikemen = humansFraction.defineUnitType('Pikemen', {
  name: 'Pikemen',
  level: 1,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 55,
  },

  // adjust retaliation damage, make it better for Halberdiers
  getDescription: simpleDescriptions([
    heroDescrElem(`While possessing good average stats, Pikemen also strikes back at any attacker.`),
    heroDescrElem(`<br>Receives bonuses from Combat Tactics speciality.`),
  ]),

  defaultModifiers: {
    counterattacks: true,
  },

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 3,
    },
    attackRating: 2,
    defence: 2,
    health: 8,
    speed: 13,
  },

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

const Crossbowmen = humansFraction.defineUnitType('Crossbowmen', {
  mainPortraitUrl: AssetsImages.UnitRanged,
  name: 'Crossbowmen',
  level: 2,

  // todo: Crossbowmen, attack penalty
  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 2 Castle ranged unit. Upgraded version of Archers.`),
    heroDescrElem(`<br>Crossbowmen are one of the fastest units, allowing hero to have an early turn against most early foes. Attacks twice per turn.`),
    heroDescrElem(`<br>Crossbowmen have higher base stats and less fragile than Archers, but also have 35% block-piercing attack.`),
    heroDescrElem(`<br>Receives bonuses from Archery specialty, granting bonus Attack Rating and Block-piercing.`),
  ]),

  baseStats: {
    damageInfo: {
      minDamage: 3,
      maxDamage: 4,
    },
    attackRating: 4,
    defence: 3,
    health: 14,
    speed: 21,
  },

  getUnitTypeSpecialtyModifiers(specialties) {
    if (specialties.specialtyArchery === 1) {
      return { heroBonusAttack: 1, blockPiercingPercent: 0.20 };
    }

    if (specialties.specialtyArchery >= 2) {
      return { heroBonusAttack: 2, blockPiercingPercent: 0.30 };
    }

    return {};
  },

  defaultModifiers: {
    isRanged: true,
    blockPiercingPercent: 0.35,
  },

  minQuantityPerStack: 12,
  defaultTurnsPerRound: 2,

  upgraded: true,

  baseRequirements: {
    gold: 120,
  },

  neutralReward: {
    experience: 4.5,
    gold: 7,
  },
})

// add action points required for location
humansFraction.defineUnitType('Archer', {
  mainPortraitUrl: AssetsImages.UnitRanged,
  name: 'Archers',
  level: 2,

  // todo: Crossbowmen, attack penalty
  getDescription: simpleDescriptions([
    heroDescrElem(`Ranged unit.`),
    heroDescrElem(`<br>Archers are one of the fastest units, allowing hero to have an early turn against most early foes. Attacks twice per turn.`),
    heroDescrElem(`<br>In return to their advantages, they are also costly and relatively fragile.`),
    heroDescrElem(`<br>Receives bonuses from Archery specialty, granting bonus Attack Rating and Block-piercing.`),
  ]),

  baseStats: {
    damageInfo: {
      minDamage: 3,
      maxDamage: 4,
    },
    attackRating: 1,
    defence: 2,
    health: 9,
    speed: 21,
  },

  upgradeDetails: {
    target: Crossbowmen,
    upgradeCost: {
      gold: 25,
    }
  },

  getUnitTypeSpecialtyModifiers(specialties) {
    if (specialties.specialtyArchery === 1) {
      return { heroBonusAttack: 1, blockPiercingPercent: 0.15 };
    }

    if (specialties.specialtyArchery >= 2) {
      return { heroBonusAttack: 2, blockPiercingPercent: 0.25 };
    }

    return {};
  },
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

  defaultModifiers: {
    isRanged: true,
  },

  minQuantityPerStack: 12,
  defaultTurnsPerRound: 2,

  baseRequirements: {
    gold: 95,
  },

  neutralReward: {
    experience: 3,
    gold: 5,
  },
});

humansFraction.defineUnitType('Knight', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Knights',
  level: 3,

  getDescription: simpleDescriptions([
    heroDescrElem(`Knights are possessing high armor and attack. `),
    heroDescrElem(`<br>Chance-based ability to block damage along with +12% to Fire, Cold and Lightning resistances makes them durable fighters.`),
  ]),

  baseStats: createStats([[6, 9], 6, 5, 17, 11]),

  minQuantityPerStack: 2,
  defaultTurnsPerRound: 1,

  baseRequirements: {
    gold: 120,
  },

  defaultSpells: [
    KnightsDamageBlock,
  ],
  defaultModifiers: {
    resistFire: 12,
    resistCold: 12,
    resistLightning: 12,
  },

  neutralReward: {
    experience: 10,
    gold: 7,
  },
});

humansFraction.defineUnitType('Cavalry', {
  name: 'Cavalry',
  mainPortraitUrl: AssetsImages.UnitMelee,

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 4 Castle units.`),
    heroDescrElem(`<br>Cavalry is armored unit type that also deals heavy damage with 55% block-piercing attack.`),
  ]),

  level: 4,

  baseStats: {
    damageInfo: { minDamage: 14, maxDamage: 19, },
    attackRating: 9,
    defence: 10,
    health: 33,
    speed: 16,
  },

  defaultTurnsPerRound: 1,
  minQuantityPerStack: 1,

  defaultModifiers: {
    blockPiercingPercent: 0.55,
  },

  baseRequirements: {
    gold: 225,
    wood: 1,
    // redCrystals: 1
  },
  neutralReward: {
    experience: 20,
    gold: 25,
  },
});

humansFraction.defineUnitType('Firebird', {
  name: 'Firebird',
  mainPortraitUrl: AssetsImages.UnitMelee,

  getDescription: simpleDescriptions([
    heroDescrElem(`Very powerful fire creatures that can heal and resurrect allied units.`),
  ]),
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
