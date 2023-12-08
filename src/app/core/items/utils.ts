import { Modifiers } from '../modifiers';
import { Resources } from '../resources';
import { itemStatsDescr, spellDescrElem } from '../ui';
import { ItemBaseModel, ItemSlotType, SpellWithConfig } from './types';

export function createItem({ name, icon, slot, stats, enemyStats, abilityDescription, cost, sellingCost, spells }: {
  name: string,
  icon: string,
  slot: ItemSlotType,
  stats: Modifiers,
  enemyStats?: Modifiers,
  // temp
  abilityDescription?: string,
  cost?: Resources,
  spells?: SpellWithConfig[],
  sellingCost?: Resources,
}): ItemBaseModel {
  return {
    name,
    icon: {
      icon,
    },
    staticMods: stats,
    slotType: slot,
    cost,
    sellingCost: sellingCost ?? { gold: 100 },
    bonusAbilities: spells,

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
