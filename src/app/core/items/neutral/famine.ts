import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


// might be a percentage penalty to armor and attack.
// and some ability.
export const FamineScytheItem: ItemBaseModel = {
  name: 'Famine',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    specialtyNecromancy: 2,
    playerBonusAttack: 6,
    /* Vampirism mod, maybe -1-2 to Defence */
  },
  staticEnemyMods: {
    // percent
    playerBonusDefence: -5,
    playerBonusAttack: -5,
    unitGroupSpeedBonus: -6,
  },
  icon: {
    icon: 'scythe',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem(`Decreases enemy attack and defence by 5, slows down all enemy units by 6`),
      ],
    };
  },
  config: {
    init() { }
  },
};
