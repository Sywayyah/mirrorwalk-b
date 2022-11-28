import { ItemBaseModel } from '../types';

export const ItemDoomstring: ItemBaseModel<{}> = {
  name: 'Doomstring',
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
