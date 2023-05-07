import { AssetsImages } from '../../assets';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { createStats } from '../utils';


neutralsFraction.defineUnitType('FireSpirits', {
  name: 'Fire Spirits',
  mainPortraitUrl: AssetsImages.Melee,
  baseRequirements: {},

  baseStats: createStats([[9, 13], 3, 3, 17, 18]),

  neutralReward: {
    experience: 10,
    gold: 15,
  },
  defaultSpells: [],
  defaultTurnsPerRound: 1,
  level: 3,
  minQuantityPerStack: 2,
})
