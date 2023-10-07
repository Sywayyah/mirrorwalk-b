import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

// Resist +15% to all.
export const WishmasterItem: ItemBaseModel = {
  name: 'Wishmaster',
  slotType: ItemSlotType.Headgear,
  staticMods: {
    heroBonusAttack: 5,
    heroBonusDefence: 4,
    resistAll: 13,
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
