import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';


neutralsFraction.defineUnitType('FireSpirits', {
  name: 'Fire Spirits',
  mainPortraitUrl: AssetsImages.UnitMelee,
  baseRequirements: {},
  level: 3,

  baseStats: createStats([[9, 13], 3, 3, 17, 18]),

  defaultModifiers: {
    resistFire: 20,
    resistCold: 15,
  },

  getDescription: simpleDescriptions([
    heroDescrElem('Creature of fire.'),
    heroDescrElem('<br>Tenacious and strong. Have increased resists against Ice and Fire.'),
  ]),

  neutralReward: {
    experience: 10,
    gold: 15,
  },
  defaultSpells: [],
  defaultTurnsPerRound: 1,
  minQuantityPerStack: 2,
})
