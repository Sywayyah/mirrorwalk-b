import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const BlackLichSwordItem: ItemBaseModel = {
  name: 'Black Lich Sword',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    playerBonusAttack: 3,
    /* Vampirism mod, maybe -1-2 to Defence */
  },
  icon: {
    icon: 'bat-sword',
  },
  description(item) {
    return {
      descriptions: [
        itemStatsDescr(item.thisItem),
      ],
    };
  },
  config: {
    init() { }
  },
};
