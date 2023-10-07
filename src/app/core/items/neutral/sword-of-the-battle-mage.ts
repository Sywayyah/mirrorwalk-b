import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

// + max mana
export const SwordOfTheBattleMageItem: ItemBaseModel = {
  name: 'Sword of the Battle Mage',
  icon: {
    icon: 'sword',
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
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
      ],
    }
  },
  config: {
    init() {
    }
  },
};
