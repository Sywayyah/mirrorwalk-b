import { AssetsImages } from '../../assets';
import { fortFraction } from '../../fractions';
import { heroDescrElem } from '../../ui';
import { simpleDescriptions } from '../utils';
import { PoisonArrowsSpell } from './spells/poison-arrows';

const defaultRewards = {
  experience: 0,
  gold: 0,
};

const Clan = fortFraction.defineUnitType('Clan', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Clan',
  level: 1,

  baseStats: {
    damageInfo: {
      minDamage: 2,
      maxDamage: 2,
    },
    attackRating: 3,
    speed: 17,
    defence: 3,
    health: 9,
  },

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 1 Fort unit. Can be upgraded into Clan.`),
    heroDescrElem(`<br>The main attacking mass of the Fort, the goblins with long sharp spears. They are cheap and fragile, but swift, allowing to get an earlier turn and can be dangerous due to the chance of dealing critical damage.`),
  ]),

  defaultModifiers: {
    counterattacks: true,
    criticalDamageChance: 0.35,
    criticalDamageMul: 1,
  },

  baseRequirements: {
    gold: 55,
    redCrystals: 0,
  },

  upgraded: true,
  neutralReward: defaultRewards,
});

fortFraction.defineUnitType('Raiders', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Raiders',
  level: 1,

  baseStats: {
    damageInfo: {
      minDamage: 1,
      maxDamage: 2,
    },
    attackRating: 1,
    speed: 16,
    defence: 2,
    health: 9,
  },

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 1 Fort unit. Can be upgraded into Clan.`),
    heroDescrElem(`<br>The main attacking mass of the Fort, the goblins with long sharp spears. They are cheap and fragile, but swift, allowing to get an earlier turn and can be dangerous due to the chance of dealing critical damage.`),
  ]),

  defaultModifiers: {
    counterattacks: true,
    criticalDamageChance: 0.35,
    criticalDamageMul: 1,
  },

  baseRequirements: {
    gold: 35,
    redCrystals: 0,
  },

  upgradeDetails: {
    target: Clan,
    upgradeCost: {
      gold: 20,
    },
  },
  neutralReward: defaultRewards,
});

const GoblinShooters = fortFraction.defineUnitType('GoblinShooter', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Goblin Shooters',
  level: 2,

  baseStats: {
    damageInfo: {
      minDamage: 1,
      maxDamage: 1,
    },
    attackRating: 1,
    speed: 14,
    defence: 4,
    health: 18,
  },

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 2 ranged unit of the Fort. Upgraded version of Goblin Archers.`),
    heroDescrElem(`<br>Basic archers that deal very low damage due to poor technologies, but mitigate that weakness by adding poison to their arrows.`),
    heroDescrElem(`<br>As an improved version of Goblin Archers they are equipped with primitive but fast-reloading crossbows, allowing them to attack 3 times per round.`),
  ]),

  defaultTurnsPerRound: 3,

  defaultSpells: [
    PoisonArrowsSpell,
  ],

  baseRequirements: {
    gold: 60,
    redCrystals: 0,
  },

  upgraded: true,

  neutralReward: defaultRewards,
});

fortFraction.defineUnitType('GoblinArcher', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Goblin Archers',
  level: 2,

  baseStats: {
    damageInfo: {
      minDamage: 1,
      maxDamage: 1,
    },
    attackRating: 1,
    speed: 14,
    defence: 3,
    health: 14,
  },

  getDescription: simpleDescriptions([
    heroDescrElem(`Tier 2 ranged unit of the Fort. Can be upgraded into Goblin Shooters.`),
    heroDescrElem(`<br>Basic archers that deal very low damage due to poor technologies, but mitigate that weakness by adding poison to their arrows. Attacks twice per turn.`),
  ]),

  defaultTurnsPerRound: 2,

  defaultSpells: [
    PoisonArrowsSpell,
  ],

  baseRequirements: {
    gold: 60,
    redCrystals: 0,
  },

  upgradeDetails: {
    target: GoblinShooters,
    upgradeCost: {
      gold: 20,
    },
  },

  neutralReward: defaultRewards,
});
