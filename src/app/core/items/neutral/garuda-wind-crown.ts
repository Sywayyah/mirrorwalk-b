import { itemStatsDescr } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

export const GarudaWindCrown: ItemBaseType = createItem({
  id: '#item-garuda-wind-crown',

  name: `Garuda's Wind Crown`,
  slot: ItemSlotType.Headgear,

  stats: {
    heroBonusAttack: 3,
    heroBonusDefence: 6,
    resistAll: 10,
    unitGroupSpeedBonus: 3,
    specialtyArchery: 2,
    cannotBeSlowed: true,
  },
  icon: 'feather-wing',
  cost: {
    gold: 5000,
    redCrystals: 2,
    gems: 2,
  },
  sellingCost: {
    gold: 2000,
    redCrystals: 1,
    gems: 1,
  },
})
