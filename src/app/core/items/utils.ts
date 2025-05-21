import { Modifiers } from '../modifiers';
import { ItemId, registerEntity } from '../entities';
import { Resources } from '../resources';
import { itemStatsDescr, spellDescrElem } from '../ui';
import { ItemAbilityDescriptionGetter, ItemBaseType, ItemConfig, ItemSlotType, SpellWithConfig } from './types';

export function createItem<StateType extends object = object>({ id, name, icon, slot, stats, enemyStats, abilityDescription, cost, sellingCost, spells, description, config }: {
  id: ItemId,
  name: string,
  icon: string,
  slot: ItemSlotType,
  stats: Modifiers,
  enemyStats?: Modifiers,
  // temp
  description?: ItemAbilityDescriptionGetter<StateType>,
  abilityDescription?: string,
  cost?: Resources,
  spells?: SpellWithConfig[],
  sellingCost?: Resources,
  config?: ItemConfig<StateType>,
}): ItemBaseType<StateType> {
  const itemBaseEntity: ItemBaseType<StateType> = {
    id,
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
    description: description ?? function ({ thisItemBase }) {
      return {
        descriptions: [
          itemStatsDescr(thisItemBase as any),
          ...(abilityDescription ? [spellDescrElem(abilityDescription)] : []),
        ],
      };
    },
    config: config ?? { init() { } }
  };

  registerEntity(itemBaseEntity);

  return itemBaseEntity;
}
