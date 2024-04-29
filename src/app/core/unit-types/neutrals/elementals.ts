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

  baseStats: createStats([[9, 13], 3, 3, 17, 18]),

  defaultModifiers: {
    resistFire: 20,
    resistCold: 15,
    isMagical: true,
  },

  getDescription: simpleDescriptions([
    heroDescrElem('Tier 3 Neutral magical creature of fire.'),
    heroDescrElem('<br>Tenacious and strong. Have increased resists against Fire (+20%) and Ice (+15%).'),
  ]),

  neutralReward: {
    experience: 20,
    gold: 20,
  },
  defaultSpells: [],
})
