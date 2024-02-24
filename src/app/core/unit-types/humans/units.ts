import { AssetsImages } from '../../assets';
import { humansFraction } from '../../factions/humans/fraction';
import { FirebirdHealSpell } from '../../spells/common';
import { KnightsDamageBlock } from '../../spells/common/damage-block/knights-damage-block';
import { ProtectionAura } from '../../spells/common/protection';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';

const defaultRewards = {
  experience: 0,
  gold: 0,
};


humansFraction.defineUnitType('Pikemen', {
  id: '#ut-h00',
  name: 'Pikemen',
  level: 1,
  mainPortraitUrl: AssetsImages.UnitMelee,

  baseRequirements: {
    gold: 55,
  },

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 1 Castle unit. Can be upgraded into Halberdier.`),
    heroDescrElem(`<br>While possessing good average stats, Pikemen also strikes back at any attacker.`),
    heroDescrElem(`<br>Receives bonuses from Combat Tactics speciality.`),
  ]),

  defaultSpells: [
    ProtectionAura,
  ],

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
    target: '#ut-h01',
    // targetId: '#ut-h01',
    upgradeCost: {
      gold: 15,
    }
  },

  neutralReward: defaultRewards,
});

humansFraction.defineUnitType('Halberdier', {
  id: '#ut-h01',
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Halberdier',
  level: 1,

  baseStats: createStats([[3, 3], 2, 3, 8, 14]),

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 1 Castle unit. Upgraded version of Pikemen.`),
    heroDescrElem(`<br>More durable and strong version of Pikemen, also retains ability to counterattack any attacker.`),
    heroDescrElem(`<br>Receives bonuses from Combat Tactics speciality.`),
  ]),

  defaultModifiers: {
    counterattacks: true,
    // maybe auras can only be granted from abilities..
    // need to check and think.
    __auraModifiers({
      remoteness,
      target,
      thisUnit,
    }) {
      if (remoteness === 1) {
        const count = thisUnit!.count * 0.8;

        return {
          chanceToBlock: 1,
          damageBlockMin: count,
          damageBlockMax: count,
        };
      }

      return null;
    }
  },

  baseRequirements: {
    gold: 70,
    redCrystals: 0,
  },
  upgraded: true,

  neutralReward: defaultRewards,
});


// add action points required for location
humansFraction.defineUnitType('Archer', {
  id: '#ut-h10',

  mainPortraitUrl: AssetsImages.UnitRanged,
  name: 'Archers',
  level: 2,

  // todo: Crossbowmen, attack penalty
  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 2 Castle ranged unit. Can be upgraded into Crossbowmen.`),
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
    target: '#ut-h11',
    // targetId: '#ut-h11',
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

humansFraction.defineUnitType('Crossbowmen', {
  id: '#ut-h11',

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

  defaultTurnsPerRound: 2,

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

  upgraded: true,

  baseRequirements: {
    gold: 120,
  },

  neutralReward: {
    experience: 4.5,
    gold: 7,
  },
})

humansFraction.defineUnitType('Knight', {
  id: '#ut-h20',
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Knights',
  level: 3,

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 3 Castle unit.`),
    heroDescrElem(`<br>Knights are possessing high armor and attack. `),
    heroDescrElem(`<br>Chance-based ability to block damage along with +12% to Fire, Cold and Lightning resistances makes them durable fighters.`),
  ]),

  baseStats: createStats([[6, 9], 6, 5, 17, 11]),

  baseRequirements: {
    gold: 120,
  },

  defaultSpells: [
    KnightsDamageBlock,
  ],
  // spells: ['#sp-h0'],

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
  id: '#ut-h30',
  name: 'Cavalry',
  mainPortraitUrl: AssetsImages.UnitMelee,

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 4 Castle cavalry unit, can be upgraded into Heavy Cavalry.`),
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

  defaultModifiers: {
    blockPiercingPercent: 0.55,
    isCavalry: true,
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
  upgradeDetails: {
    target: '#ut-h31',
    upgradeCost: {
      gold: 85,
    },
  },
});

humansFraction.defineUnitType('HeavyCavalry', {
  id: '#ut-h31',
  name: 'Heavy Cavalry',
  mainPortraitUrl: AssetsImages.UnitMelee,

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 4 Castle cavalry unit, upgraded version of Cavalry.`),
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

  defaultModifiers: {
    blockPiercingPercent: 0.55,
    isCavalry: true,
  },

  baseRequirements: {
    gold: 310,
    wood: 1,
    // redCrystals: 1
  },
  neutralReward: {
    experience: 25,
    gold: 35,
  },
  upgraded: true,
});

humansFraction.defineUnitType('MysticBird', {
  id: '#ut-h40',

  name: 'Mystic Birds',
  mainPortraitUrl: AssetsImages.FireBird,
  level: 5,

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 5 Castle majestic creatures of fire. Can be upgraded into Firebirds.`),
    heroDescrElem(`<br>Powerful creatures of fire that can heal and resurrect allied units, also has 10% resist against fire.`),
  ]),

  baseStats: createStats([[18, 26], 8, 10, 46, 16]),

  defaultSpells: [
    FirebirdHealSpell,
  ],
  // spells: ['#sp-firebird-heal'],

  defaultModifiers: {
    resistFire: 10,
  },

  baseRequirements: {
    gold: 350,
    wood: 1,
  },
  upgradeDetails: {
    target: '#ut-h41',
    upgradeCost: {
      gold: 125,
    },
  },
  neutralReward: {
    experience: 40,
    gold: 60,
  },
});

humansFraction.defineUnitType('Firebird', {
  id: '#ut-h41',
  name: 'Firebirds',
  mainPortraitUrl: AssetsImages.FireBird,
  level: 5,

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 5 Castle majestic creatures of fire, an upgraded version of Mystic Birds.`),
    heroDescrElem(`<br>Powerful creatures of fire that can heal and resurrect allied units, has better stats than Mystical Birds and +17% fire resistance.`),
  ]),

  baseStats: createStats([[23, 29], 12, 14, 57, 17]),

  defaultModifiers: {
    resistFire: 17,
  },

  defaultSpells: [
    FirebirdHealSpell,
  ],

  baseRequirements: {
    gold: 475,
    wood: 1,
  },

  neutralReward: {
    experience: 45,
    gold: 60,
  },
})

// possible tier 4-6 unit: Monks, might increase your magical capabilities
// Knights could have a branching: Paladins, or something else

// Pikeman can give bonuses to some aura-like spells, like Valor.

// possible tier 7 for humans
//   fast, normal tier 7 stats
//   can deal lightning damage
// humansFraction.defineUnitType('Thunderer', {});
// humansFraction.defineUnitType('Valkyrie', {});
