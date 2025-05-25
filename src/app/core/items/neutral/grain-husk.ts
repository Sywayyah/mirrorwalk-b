import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

export const GrainHuskItem: ItemBaseType = createItem({
  id: '#item-grain-husk',

  name: 'Grain Husk',
  slot: ItemSlotType.Weapon,
  icon: 'scythe',
  stats: {
    heroBonusAttack: 2,
    heroManacostPenalty: 3,
  },
  enemyStats: {
    heroBonusDefence: -3,
    heroBonusAttack: -3,
    unitGroupSpeedBonus: -2,
  },
  cost: {
    gold: 1700,
    gems: 5
  },
  sellingCost: {
    gold: 650,
  },
});
