import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';
import { createItem } from '../utils';


export const GrainHuskItem: ItemBaseModel = createItem({
  id: '#item-grain-husk',

  name: 'Grain Husk',
  slot: ItemSlotType.Weapon,
  icon: 'scythe',
  stats: {
    heroBonusAttack: 2,
  },
  enemyStats: {
    heroBonusDefence: -3,
    heroBonusAttack: -3,
    unitGroupSpeedBonus: -2,
  },
  cost: {
    gold: 1000,
  },
  sellingCost: {
    gold: 650,
  },
});
