import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

export const WishmasterItem: ItemBaseType = createItem({
  id: '#item-wishmaster',

  name: 'Wishmaster',
  slot: ItemSlotType.Headgear,
  stats: {
    heroBonusAttack: 5,
    heroBonusDefence: 4,
    resistAll: 13,
  },
  cost: {
    gems: 20,
    gold: 2000,
    redCrystals: 2,
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
