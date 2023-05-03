import { WindBlessBuff } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

// Resist +30% to all.
export const WishmasterItem: ItemBaseModel = {
  name: 'Wishmaster',
  slotType: ItemSlotType.Headgear,
  staticMods: {
    playerBonusAttack: 8,
    playerBonusDefence: 7,
  },
  icon: {
    icon: 'feather-wing',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem('An artefact of incredible strength.'),
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
          }
        }
      })
    },
  },
}
