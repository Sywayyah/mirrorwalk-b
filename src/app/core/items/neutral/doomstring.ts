import { itemStatsDescr } from '../../ui';
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
  description: ({ thisItem }) => {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
      ],
    };
  },
  config: {
    init: () => { },
  }
};
