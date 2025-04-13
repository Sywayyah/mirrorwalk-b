import { AssetsImages } from '../../assets';
import { neutralsFaction } from '../../factions/neutrals/faction';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';

neutralsFaction.defineUnitType({
  id: '#unit-neut-brogbat',
  name: 'Brogbats',
  level: 2,
  mainPortraitUrl: AssetsImages.UnitMelee,
  getDescription: simpleDescriptions([
    'Brogbats are tier 2 creatures with average stats.',
    'Bat species from the dusky lands of Brog.',
  ]),
  baseRequirements: {
    gold: 75,
  },
  baseStats: {
    attackRating: 3,
    defence: 3,
    damageInfo: { minDamage: 4, maxDamage: 5 },
    health: 13,
    speed: 2,
  },
  neutralReward: {
    experience: 12,
    gold: 10,
  },
});

neutralsFaction.defineUnitType({
  id: '#unit-neut-gnoll-0',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Gnolls',
  level: 1,

  baseStats: createStats([[3, 4], 1, 1, 10, 12]),

  getDescription: simpleDescriptions([
    heroDescrElem('Gnolls are tier 1 forest dwellers with average stats.'),
    heroDescrElem(
      'Mostly known for being bandits, they possess a fire resistant fur, giving them +10% to Fire Resist.',
    ),
  ]),

  defaultSpells: [
    '#spell-neut-gnoll-crush',
  ],
  defaultModifiers: {
    resistFire: 10,
    isForest: true,
  },

  baseRequirements: {
    gold: 100,
  },

  neutralReward: {
    experience: 3.3,
    gold: 3.2,
  },
});

neutralsFaction.defineUnitType({
  id: '#unit-neut-poison-ivy-0',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Poison Ivy',
  level: 2,

  baseStats: createStats([[3, 4], 1, 1, 10, 10]),

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 2 forest dweller.'),
    heroDescrElem(
      'A living plant, a sturdy enemy with venomous attack, but vulnerable to any magic damage.',
    ),
  ]),

  defaultModifiers: {
    resistAll: -20,
    isForest: true,
  },

  baseRequirements: {
    gold: 10,
  },

  neutralReward: {
    experience: 4.5,
    gold: 3.2,
  },
});

neutralsFaction.defineUnitType({
  id: '#unit-neut-thief-0',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Thieves',
  level: 2,

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 2 forest dweller.'),
    heroDescrElem(
      '<br>Thieves are very dangerous despite being fragile. Their high speed allows them to have their turn earlier, and ability to attack twice, along with high damage, can result in heavy losses.',
    ),
  ]),

  baseStats: createStats([[6, 7], 2, 1, 9, 16]),

  defaultTurnsPerRound: 2,
  defaultModifiers: {
    isForest: true,
  },

  baseRequirements: {},
  neutralReward: {
    experience: 4.55,
    gold: 4.7,
  },
});

// maybe add crushing blow, ability that reduces damage of the attacked unit group
neutralsFaction.defineUnitType({
  id: '#unit-neut-forest-troll-0',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Forest Trolls',
  level: 3,

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 3 forest dweller.'),
    heroDescrElem(
      '<br>Durable and strong, groups of Forest Trolls can absorb big damage, but their slowness usually makes them use their move last.',
    ),
  ]),

  baseStats: createStats([[5, 7], 3, 4, 17, 10]),

  defaultModifiers: {
    isForest: true,
  },

  baseRequirements: {},
  neutralReward: {
    experience: 6,
    gold: 6,
  },
});
