import { ItemBaseType, ItemSlotType } from '..';
import { MeteorSpell } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';
import { createItem } from '../utils';

export const ItemMeteorSwords: ItemBaseType<{}> = createItem({
  id: '#item-meteor-sword',

  name: 'Meteor Swords',
  slot: ItemSlotType.Weapon,
  icon: 'dervish-swords',
  stats: {
    heroBonusAttack: 2,
    specialtyFireMastery: 1,
  },
  cost: {
    gold: 1100,
  },
  sellingCost: {
    gold: 450,
  },
  spells: [
    // item version could have lesser damage and higher manacost
    { spell: MeteorSpell, level: 1 },
  ],
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem('Two large black swords with an astronomical map depicted in gold on the blade. Grants Level 1 Meteor ability.'),
      ],
    };
  },
});
