import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


// might be a percentage penalty to armor and attack.
// and some ability.
export const FamineScytheItem: ItemBaseModel = {
  name: 'Famine',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    playerBonusAttack: 6,
    /* Vampirism mod, maybe -1-2 to Defence */
  },
  staticEnemyMods: {
    playerBonusDefence: -5,
    playerBonusAttack: -5,
    unitGroupSpeedBonus: -2,
  },
  icon: {
    icon: 'scythe',
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
