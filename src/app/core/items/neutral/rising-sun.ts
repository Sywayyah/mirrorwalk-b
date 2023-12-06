import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

const healValue = 50;

// Ideas for healing items:
//  1. Heal random amount of units.
//  2. Heal with ranged value (e.g. 25-40)
export const RisingSunPendant: ItemBaseModel = {
  name: 'Rising Sun',
  icon: {
    icon: 'gem-pendant',
  },
  slotType: ItemSlotType.Amulet,
  staticMods: {
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
};
