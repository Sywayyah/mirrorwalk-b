import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { heroDescrElem, spellDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';

neutralsFraction.defineUnitType('Gnoll', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Gnolls',
  level: 2,

  baseStats: createStats([[3, 4], 1, 1, 10, 12]),

  getDescription: simpleDescriptions([
    heroDescrElem('Gnolls are tier 2 neutral units, having average stats.'),
    heroDescrElem('<br>Mostly known for being bandits, they possess a fire resistant fur, giving them +12% to Fire Resist.'),
  ]),

  defaultModifiers: {
    resistFire: 12,
  },

  minQuantityPerStack: 5,
  defaultTurnsPerRound: 1,

  baseRequirements: {
    gold: 100,
    redCrystals: 0,
  },

  neutralReward: {
    experience: 3.3,
    gold: 2.8
  },
});

neutralsFraction.defineUnitType('Thiefs', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Thiefs',
  level: 3,

  getDescription: simpleDescriptions([
    heroDescrElem('Thiefs are tier 3 neutral units.'),
    heroDescrElem('<br>While being fragile, they are very dangerous due to their high speed and ability to attack twice per round.'),
  ]),

  baseStats: createStats([[6, 7], 2, 1, 9, 17]),

  minQuantityPerStack: 4,
  defaultTurnsPerRound: 2,

  baseRequirements: {},
  neutralReward: {
    experience: 4.55,
    gold: 3.9
  }
});

neutralsFraction.defineUnitType('ForestTrolls', {
  mainPortraitUrl: AssetsImages.UnitMelee,
  name: 'Trolls',
  level: 4,

  getDescription: simpleDescriptions([
    heroDescrElem('Forest Trolls are tier 4 neutral units.'),
    heroDescrElem('<br>Durable and strong, groups of Forest Trolls can absorb big damage.'),
  ]),

  baseStats: createStats([[5, 7], 3, 4, 13, 10]),

  minQuantityPerStack: 2,
  defaultTurnsPerRound: 1,

  baseRequirements: {},
  neutralReward: {
    experience: 4,
    gold: 4.6,
  }
});
