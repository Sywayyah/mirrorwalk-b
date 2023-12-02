import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

export const FlamingSword: ItemBaseModel = {
  name: 'Flaming Sword',
  icon: {
    icon: 'sword',
  },
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 3,
    heroMaxMana: 6,
    specialtyFireMastery: 3,
  },
  cost: {
    gold: 1500,
  },
  description({ thisItemBase }) {
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
