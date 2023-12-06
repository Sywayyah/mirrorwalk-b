import { EnchantBuff } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

export const ItemEclipseWand: ItemBaseModel<{}> = {
  name: 'Eclipse Wand',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    specialtyMagic: 1,
    specialtyMagicRecovery: 1,
    heroMaxMana: 5,
  },
  icon: {
    icon: 'crystal-wand',
  },
  cost: { gold: 550 },
  sellingCost: { gold: 300 },
  defaultState: {},
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem('At the beginning of the battle, applies level 1 Enchant to all enemy groups.')
      ],
    };
  },
  config: {
    init: ({ actions, events, ownerPlayer }) => {

      events.on({
        NewRoundBegins(event) {
          if (event.round === 0) {
            const enemyPlayer = actions.getEnemyOfPlayer(ownerPlayer);
            const enemyUnitGroups = actions.getUnitGroupsOfPlayer(enemyPlayer);

            enemyUnitGroups.forEach(unitGroup => {
              const enchantDebuff = actions.createSpellInstance(EnchantBuff, { initialLevel: 1 });

              actions.addSpellToUnitGroup(unitGroup, enchantDebuff, ownerPlayer);
            });
          }
        },
      });

    },
  }
};
