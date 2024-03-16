import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';
import { createItem } from '../utils';

export const WishmasterItem: ItemBaseModel = createItem({
  id: '#item-wishmaster',

  name: 'Wishmaster',
  slot: ItemSlotType.Headgear,
  stats: {
    heroBonusAttack: 5,
    heroBonusDefence: 4,
    resistAll: 13,
  },
  icon: 'feather-wing',
  description({ thisItem, thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem('An artefact of incredible strength.'),
      ],
    };
  },
})
