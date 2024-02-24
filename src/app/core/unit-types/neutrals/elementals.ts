import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../factions/neutrals/fraction';
import { heroDescrElem } from '../../ui';
import { createStats, simpleDescriptions } from '../utils';


neutralsFraction.defineUnitType('FireSpirits', {
  id: '#ut-neut-fire-spirits',
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
    heroDescrElem('<br>Tenacious and strong. Have increased resists against Fire (+20%) and Ice (+15%).'),
  ]),

  neutralReward: {
    experience: 20,
    gold: 20,
  },
  defaultSpells: [],
})
