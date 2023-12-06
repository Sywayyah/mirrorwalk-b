import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const IrtonPlateItem: ItemBaseModel = {
  name: 'Irton Plate',
  slotType: ItemSlotType.Armor,
  icon: {
    icon: 'vest',
  },
  cost: {
    gold: 300,
  },
  sellingCost: {
    gold: 175,
  },
  staticMods: {
    heroBonusDefence: 3,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
      ],
    }
  },
  config: { init() { } },
};
