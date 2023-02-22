import { itemStatsDescr } from '../ui';
import { Modifiers } from '../unit-types';
import { ItemBaseModel, ItemSlotType } from './types';

export function createItem({ name, icon, slot, stats }: {
  name: string,
  icon: string,
  slot: ItemSlotType,
  stats: Modifiers
}): ItemBaseModel {
  return {
    name,
    icon: {
      icon,
    },
    staticMods: stats,
    slotType: slot,
    description({ thisItem }) {
      return {
        descriptions: [
          itemStatsDescr(thisItem),
        ],
      }
    },
    config: { init() { } }
  };
}
