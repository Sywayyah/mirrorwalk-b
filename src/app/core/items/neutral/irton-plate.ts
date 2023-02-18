import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const IrtonPlateItem: ItemBaseModel = {
  name: 'Irton Plate',
  slotType: ItemSlotType.Armor,
  icon: {
    icon: 'west',
  },
  staticMods: {
    playerBonusDefence: 2,
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
      ],
    }
  },
  config: { init() { } },
};
