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
  description(item) {
    return {
      descriptions: [],
    }
  },
  config: { init() { } },
};
