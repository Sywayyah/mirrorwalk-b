import { ItemBaseModel, ItemType } from '../types';

export const ItemDoomstring: ItemBaseModel<{}> = {
  name: 'Doomstring',
  type: ItemType.Weapon,
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
