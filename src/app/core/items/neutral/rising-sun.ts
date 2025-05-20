import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

const healValue = 50;

// Ideas for healing items:
//  1. Heal random amount of units.
//  2. Heal with ranged value (e.g. 25-40)
export const RisingSunPendant: ItemBaseType = createItem({
  id: '#item-rising-sun',

  name: 'Rising Sun',
  icon: 'gem-pendant',
  slot: ItemSlotType.Amulet,
  stats: {
    heroBonusDefence: 2,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem(`Each round heals your units by ${healValue}`),
      ],
    }
  },

  config: {
    // todo: provide vfx
    init({ events, actions, ownerPlayer }) {
      events.on({
        NewRoundBegins: () => {
          const ownerUnitGroups = actions.getUnitGroupsOfPlayer(ownerPlayer);

          ownerUnitGroups.forEach((unitGroup) => {
            actions.healUnit(unitGroup, healValue);
          });
        },
      })
    }
  },
});
