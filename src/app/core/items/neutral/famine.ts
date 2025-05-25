import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

// might be a percentage penalty to armor and attack.
// and some ability.
export const FamineScytheItem: ItemBaseType = createItem({
  id: '#item-famine',

  name: 'Famine',
  slot: ItemSlotType.Weapon,
  icon: 'scythe',
  stats: {
    specialtyNecromancy: 2,
    heroBonusAttack: 6,
    heroManacostPenalty: 4,
    /* Vampirism mod, maybe -1-2 to Defence */
  },
  enemyStats: {
    // percent
    heroBonusDefence: -5,
    heroBonusAttack: -5,
    unitGroupSpeedBonus: -6,
  },
  cost: {
    gold: 6000,
    redCrystals: 3,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem(`Decreases enemy attack and defence by 5, slows down all enemy units by 6`),
      ],
    };
  },
});
