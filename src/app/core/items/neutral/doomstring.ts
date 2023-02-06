import { ItemBaseModel, ItemSlotType } from '../types';

export const ItemDoomstring: ItemBaseModel<{}> = {
  name: 'Doomstring',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    playerBonusAttack: 2,
  },
  icon: {
    icon: 'crossbow',
  },
  defaultState: {},
  description: () => '+2 to Attack.',
  config: {
    init: () => { },
  }
};
