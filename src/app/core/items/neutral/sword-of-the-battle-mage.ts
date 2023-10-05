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
    playerBonusAttack: 3,

    specialtyFireMastery: 1,
    specialtyColdMastery: 1,
    specialtyLightningMastery: 1,

    specialtyMagicRecovery: 2,
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
