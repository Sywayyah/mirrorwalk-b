import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';
import { createItem } from '../utils';

// + max mana
export const SwordOfTheBattleMageItem: ItemBaseModel = createItem({
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
    redCrystals: 1,
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
