import { ItemBaseType, ItemSlotType } from '..';
import { WindBlessBuff } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';
import { createItem } from '../utils';

export const ItemWindCrest: ItemBaseType = createItem({
  id: '#item-wind-crest',

  name: 'Wind Crest',
  slot: ItemSlotType.Headgear,
  stats: {
    heroBonusDefence: 1,
  },
  icon: 'feather-wing',
  cost: {
    gold: 500,
  },
  sellingCost: {
    gold: 250,
  },
  description({ thisItem, thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem('At the beginning of the fight, grants Wind Blessing (level 1) effect to your ranged units for 1 round.'),
      ],
    };
  },
  config: {
    init: ({
      actions, events, ownerPlayer,
    }) => {
      events.on({
        NewRoundBegins(event) {
          if (event.round === 0) {
            actions.getUnitGroupsOfPlayer(ownerPlayer)
              .filter(unitGroup => unitGroup.type.defaultModifiers?.isRanged)
              .forEach(rangedUnitGroup => {
                const windBlessBuff = actions.createSpellInstance(WindBlessBuff);

                actions.addSpellToUnitGroup(rangedUnitGroup, windBlessBuff, ownerPlayer);
              });
          }
        }
      })
    },
  },
})
