import { AssetsImages } from '../../assets';
import { neutralsFaction } from '../../factions/neutrals/fraction';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';

neutralsFaction.defineUnitType('Gnoll', {
  id: '#ut-neut-gnoll',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Gnolls',
  level: 1,

  baseStats: createStats([[3, 4], 1, 1, 10, 12]),

  getDescription: simpleDescriptions([
    heroDescrElem('Gnolls are tier 1 neutral units with average stats.'),
    heroDescrElem('Mostly known for being bandits, they possess a fire resistant fur, giving them +10% to Fire Resist.'),
  ]),

  defaultModifiers: {
    resistFire: 10,
  },

  baseRequirements: {
    gold: 100,
    redCrystals: 0,
  },

  neutralReward: {
    experience: 3.3,
    gold: 3.2,
  },
});

neutralsFaction.defineUnitType('Thieves', {
  id: '#ut-neut-thief',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Thieves',
  level: 2,

  getDescription: simpleDescriptions([
    heroDescrElem('Thieves are tier 2 neutral units.'),
    heroDescrElem('<br>Thieves are very dangerous despite being fragile. Their high speed allows them to have their turn earlier, and ability to attack twice, along with high damage, can result in heavy losses.'),
  ]),

  baseStats: createStats([[6, 7], 2, 1, 9, 16]),

  defaultTurnsPerRound: 2,

  baseRequirements: {},
  neutralReward: {
    experience: 4.55,
    gold: 4.7,
  }
});

// maybe add crushing blow, ability that reduces damage of the attacked unit group
neutralsFaction.defineUnitType('ForestTrolls', {
  id: '#ut-neut-forest-troll',

  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Forest Trolls',
  level: 3,

  getDescription: simpleDescriptions([
    heroDescrElem('Forest Trolls are tier 3 neutral units.'),
    heroDescrElem('<br>Durable and strong, groups of Forest Trolls can absorb big damage, but their slowness usually makes them use their move last.'),
  ]),

  baseStats: createStats([[5, 7], 3, 4, 17, 10]),

  baseRequirements: {},
  neutralReward: {
    experience: 6,
    gold: 6,
  }
});
