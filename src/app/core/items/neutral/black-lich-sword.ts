import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const BlackLichSwordItem: ItemBaseModel = {
  name: 'Black Lich Sword',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    playerBonusAttack: 3,
    lifesteal: 10,
    /* Vampirism mod, maybe -1-2 to Defence */
  },
  icon: {
    icon: 'bat-sword',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
      ],
    };
  },
  config: {
    init() { }
  },
};
