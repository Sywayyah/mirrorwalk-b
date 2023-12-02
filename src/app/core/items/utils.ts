import { Modifiers } from '../modifiers';
import { Resources } from '../resources';
import { itemStatsDescr, spellDescrElem } from '../ui';
import { ItemBaseModel, ItemSlotType } from './types';

export function createItem({ name, icon, slot, stats, enemyStats, abilityDescription, cost }: {
  name: string,
  icon: string,
  slot: ItemSlotType,
  stats: Modifiers,
  enemyStats?: Modifiers,
  // temp
  abilityDescription?: string,
  cost?: Resources,
}): ItemBaseModel {
  return {
    name,
    cost,
    icon: {
      icon,
    },
    staticMods: stats,
    slotType: slot,

    staticEnemyMods: enemyStats,
    description({ thisItemBase }) {
      return {
        descriptions: [
          itemStatsDescr(thisItemBase),
          ...(abilityDescription ? [spellDescrElem(abilityDescription)] : []),
        ],
      }
    },
    config: { init() { } }
  };
}
