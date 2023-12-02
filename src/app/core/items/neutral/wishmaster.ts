import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

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
  description({ thisItem, thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem('An artefact of incredible strength.'),
      ],
    };
  },
  config: {
    init: () => {

    },
  },
}
