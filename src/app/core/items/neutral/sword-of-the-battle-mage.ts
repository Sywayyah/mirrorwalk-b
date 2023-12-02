import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

// + max mana
export const SwordOfTheBattleMageItem: ItemBaseModel = {
  name: 'Sword of the Battle Mage',
  icon: {
    icon: 'sword',
  },
  cost: {
    gold: 1000,
    redCrystals: 1,
  },
  sellingCost: {
    gold: 600,
  },
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 3,
    heroMaxMana: 8,
    specialtyMagicRecovery: 2,

    specialtyFireMastery: 1,
    specialtyColdMastery: 1,
    specialtyLightningMastery: 1,

  },
  description({ thisItem, thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
      ],
    }
  },
  config: {
    init() {
    }
  },
};
