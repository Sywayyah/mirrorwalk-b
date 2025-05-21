import { itemStatsDescr } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';


export const IrtonPlateItem: ItemBaseType = createItem({
  id: '#item-irton-plate',

  name: 'Irton Plate',
  slot: ItemSlotType.Armor,
  icon: 'vest',
  cost: {
    gold: 300,
  },
  sellingCost: {
    gold: 175,
  },
  stats: {
    heroBonusDefence: 3,
  },
});
