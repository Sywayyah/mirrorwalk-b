import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';
import { createItem } from '../utils';

export const FlamingSword: ItemBaseModel = createItem({
  id: '#item-flaming-sword',

  name: 'Flaming Sword',
  icon: 'sword',
  slot: ItemSlotType.Weapon,
  stats: {
    heroBonusAttack: 3,
    heroMaxMana: 6,
    specialtyFireMastery: 3,
  },
  cost: {
    gold: 1500,
  },
  sellingCost: {
    gold: 800,
  },
});
