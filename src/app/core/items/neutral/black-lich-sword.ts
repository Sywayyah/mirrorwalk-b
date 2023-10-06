import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const BlackLichSwordItem: ItemBaseModel = {
  name: 'Black Lich Sword',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 3,
    lifesteal: 10,
    specialtyNecromancy: 1,
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
