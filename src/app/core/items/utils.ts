import { Modifiers } from '../modifiers';
import { itemStatsDescr, spellDescrElem } from '../ui';
import { ItemBaseModel, ItemSlotType } from './types';

export function createItem({ name, icon, slot, stats, enemyStats, abilityDescription }: {
  name: string,
  icon: string,
  slot: ItemSlotType,
  stats: Modifiers,
  enemyStats?: Modifiers,
  // temp
  abilityDescription?: string,
}): ItemBaseModel {
  return {
    name,
    icon: {
      icon,
    },
    staticMods: stats,
    slotType: slot,

    staticEnemyMods: enemyStats,
    description({ thisItem }) {
      return {
        descriptions: [
          itemStatsDescr(thisItem),
          ...(abilityDescription ? [spellDescrElem(abilityDescription)] : []),
        ],
      }
    },
    config: { init() { } }
  };
}
