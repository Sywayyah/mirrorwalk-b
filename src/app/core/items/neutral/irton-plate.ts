import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const IrtonPlateItem: ItemBaseModel = {
  name: 'Irton Plate',
  slotType: ItemSlotType.Armor,
  icon: {
    icon: 'vest',
  },
  staticMods: {
    heroBonusDefence: 3,
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
