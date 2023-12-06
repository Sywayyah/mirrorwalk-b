import { ItemBaseModel, ItemSlotType } from '..';
import { WindBlessBuff } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';

export const ItemWindCrest: ItemBaseModel = {
  name: 'Wind Crest',
  slotType: ItemSlotType.Headgear,
  staticMods: {
    heroBonusDefence: 1,
  },
  icon: {
    icon: 'feather-wing',
  },
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
}
