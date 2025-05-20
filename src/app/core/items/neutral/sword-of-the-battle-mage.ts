import { itemStatsDescr } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

// + max mana
export const SwordOfTheBattleMageItem: ItemBaseType = createItem({
  id: '#item-battlemage-sword',

  name: 'Sword of the Battle Mage',
  slot: ItemSlotType.Weapon,
  icon: 'sword',
  stats: {
    heroBonusAttack: 3,
    heroMaxMana: 8,
    specialtyMagicRecovery: 2,

    specialtyFireMastery: 1,
    specialtyColdMastery: 1,
    specialtyLightningMastery: 1,

  },
  cost: {
    gold: 1000,
    gems: 6,
  },
  sellingCost: {
    gold: 600,
  },

  description({ thisItem, thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
      ],
    }
  }
});
