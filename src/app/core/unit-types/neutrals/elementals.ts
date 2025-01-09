import { AssetsImages } from '../../assets';
import { neutralsFaction } from '../../factions/neutrals/faction';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';

neutralsFaction.defineUnitType({
  id: '#unit-neut-fire-spirit-0',
  name: 'Fire Spirits',
  mainPortraitUrl: AssetsImages.UnitMelee,
  baseRequirements: {},
  level: 3,

  baseStats: createStats([[13, 18], 3, 3, 22, 17, 1]),

  defaultModifiers: {
    resistFire: 20,
    resistCold: 15,
    isMagical: true,
  },

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 3 Neutral magical creature of fire.'),
    heroDescrElem(
      '<br>Tenacious and strong. Have increased resists against Fire (+20%) and Ice (+15%).',
    ),
    heroDescrElem('<br>Has base manapool of 1.'),
  ]),

  neutralReward: {
    experience: 20,
    gold: 20,
  },
  defaultSpells: [],
});

neutralsFaction.defineUnitType({
  id: '#unit-neut-wind-spirit-0',
  name: 'Wind Elementals',
  mainPortraitUrl: AssetsImages.UnitMelee,
  baseRequirements: {},
  level: 3,

  baseStats: createStats([[12, 16], 4, 5, 28, 16, 4]),

  defaultModifiers: {
    resistFire: 20,

    resistCold: 15,
    isMagical: true,
  },

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 4 Neutral magical creature of wind.'),
    heroDescrElem('<br>Haste spell always grants an additional turn.'),
    heroDescrElem('<br>Has base manapool of 4.'),
  ]),

  neutralReward: {
    experience: 20,
    gold: 20,
  },
  defaultSpells: [],
});
