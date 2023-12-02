import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


// might be a percentage penalty to armor and attack.
// and some ability.
export const FamineScytheItem: ItemBaseModel = {
  name: 'Famine',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    specialtyNecromancy: 2,
    heroBonusAttack: 6,
    /* Vampirism mod, maybe -1-2 to Defence */
  },
  staticEnemyMods: {
    // percent
    heroBonusDefence: -5,
    heroBonusAttack: -5,
    unitGroupSpeedBonus: -6,
  },
  icon: {
    icon: 'scythe',
  },
  cost: {
    gold: 6000,
    redCrystals: 3
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem(`Decreases enemy attack and defence by 5, slows down all enemy units by 6`),
      ],
    };
  },
  config: {
    init() { }
  },
};
