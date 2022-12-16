import { EnchantBuff } from '../../spells/common';
import { ItemBaseModel, GameEventTypes } from '../types';

export const ItemEclipseWand: ItemBaseModel<{}> = {
  name: 'Eclipse Wand',
  staticMods: {
  },
  icon: {
    icon: 'crystal-wand',
  },
  defaultState: {},
  description: () => 'At the beginning of the battle, applies level 1 Enchant to all enemy groups.',
  config: {
    init: ({ actions, events, ownerPlayer }) => {

      events.on({
        [GameEventTypes.NewRoundBegins]: event => {
          if (event.round === 0) {
            const enemyPlayer = actions.getEnemyPlayer();
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