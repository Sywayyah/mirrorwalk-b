import { ItemBaseModel, ItemSlotType } from '..';
import { WindBlessBuff } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';

export const ItemWindCrest: ItemBaseModel = {
  name: 'Wind Crest',
  slotType: ItemSlotType.Headgear,
  staticMods: {
    playerBonusAttack: 2,
    playerBonusDefence: 1,
  },
  icon: {
    icon: 'feather-wing',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
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
