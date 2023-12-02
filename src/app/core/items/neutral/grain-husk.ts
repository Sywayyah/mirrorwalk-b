import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const GrainHuskItem: ItemBaseModel = {
  name: 'Grain Husk',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 2,
  },
  staticEnemyMods: {
    heroBonusDefence: -3,
    heroBonusAttack: -3,
    unitGroupSpeedBonus: -2,
  },
  icon: {
    icon: 'scythe',
  },
  cost: {
    gold: 1000,
  },
  sellingCost: {
    gold: 650,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
      ],
    };
  },
  config: {
    init() { }
  },
};
