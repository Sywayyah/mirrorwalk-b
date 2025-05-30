import { AssetsImages } from '../../assets';
import { fortFaction } from '../../factions';
import { heroDescrElem } from '../../ui';
import { simpleDescriptions } from '../utils';

const defaultRewards = {
  experience: 0,
  gold: 0,
};

fortFaction.defineUnitType({
  id: '#unit-f00',
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
    heroDescrElem(
      `<br>The main attacking mass of the Fort, the goblins with long sharp spears. They are cheap and fragile, but swift, allowing to get an earlier turn and can be dangerous due to the chance of dealing critical damage.`,
    ),
  ]),

  defaultModifiers: {
    counterattacks: true,
    criticalDamageChance: 0.35,
    criticalDamageMul: 1,
    isPinner: true,
    pinningIncomingDamagePercent: 1.5,
  },

  defaultSpells: ['#spell-universal-pin'],

  baseRequirements: {
    gold: 35,
    redCrystals: 0,
  },

  upgradeDetails: {
    target: '#unit-f01',
    upgradeCost: {
      gold: 20,
    },
  },
  neutralReward: defaultRewards,
});

fortFaction.defineUnitType({
  id: '#unit-f01',
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
    heroDescrElem(`Tier 1 Fort unit, upgraded version of Raiders.`),
    heroDescrElem(
      `<br>The main attacking mass of the Fort, the goblins with long sharp spears. They are cheap and fragile, but swift, allowing to get an earlier turn and can be dangerous due to the chance of dealing critical damage.`,
    ),
  ]),

  defaultModifiers: {
    counterattacks: true,
    criticalDamageChance: 0.35,
    criticalDamageMul: 1,
    isPinner: true,
    pinningIncomingDamagePercent: 1.5,
  },

  defaultSpells: ['#spell-universal-pin'],

  baseRequirements: {
    gold: 55,
    redCrystals: 0,
  },

  upgraded: true,
  neutralReward: defaultRewards,
});

fortFaction.defineUnitType({
  id: '#unit-f10',
  mainPortraitUrl: AssetsImages.UnitRanged,
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
    heroDescrElem(
      `Tier 2 ranged unit of the Fort. Can be upgraded into Goblin Shooters.`,
    ),
    heroDescrElem(
      `<br>Basic archers that deal very low damage due to poor technologies, but mitigate that weakness by adding poison to their arrows. Attacks twice per turn.`,
    ),
  ]),

  defaultTurnsPerRound: 2,

  defaultModifiers: {
    isRanged: true,
  },
  defaultSpells: ['#spell-unit-poison-arrows'],

  baseRequirements: {
    gold: 60,
    redCrystals: 0,
  },

  upgradeDetails: {
    target: '#unit-f11',
    upgradeCost: {
      gold: 20,
    },
  },

  neutralReward: defaultRewards,
});

fortFaction.defineUnitType({
  id: '#unit-f11',

  mainPortraitUrl: AssetsImages.UnitRanged,
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
    heroDescrElem(
      `Tier 2 ranged unit of the Fort. Upgraded version of Goblin Archers.`,
    ),
    heroDescrElem(
      `<br>Basic archers that deal very low damage due to poor technologies, but mitigate that weakness by adding poison to their arrows.`,
    ),
    heroDescrElem(
      `<br>As an improved version of Goblin Archers they are equipped with primitive but fast-reloading crossbows, allowing them to attack 3 times per round.`,
    ),
  ]),

  defaultModifiers: {
    isRanged: true,
  },

  defaultTurnsPerRound: 3,

  defaultSpells: ['#spell-unit-poison-arrows'],

  baseRequirements: {
    gold: 60,
    redCrystals: 0,
  },

  upgraded: true,

  neutralReward: defaultRewards,
});
