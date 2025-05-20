import { ItemBaseType, ItemSlotType } from '..';
import { FrostArrowSpell } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';
import { createItem } from '../utils';

export const ItemIceBow: ItemBaseType<{}> = createItem({
  id: '#item-ice-bow',

  name: 'Ice Bow',
  slot: ItemSlotType.Weapon,
  icon: 'frozen-arrow',
  stats: {
    heroBonusAttack: 1,
    specialtyArchery: 1,
  },
  cost: {
    gold: 500,
  },
  sellingCost: {
    gold: 400,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem('Bow which radiates cold, grants level 1 Frost Arrow'),
      ],
    };
  },
  spells: [
    { level: 1, spell: FrostArrowSpell },
  ],
});
