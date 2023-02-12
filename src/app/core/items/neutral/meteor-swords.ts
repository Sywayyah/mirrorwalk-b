import { ItemBaseModel, ItemSlotType } from '..';
import { MeteorSpell } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';

export const ItemMeteorSwords: ItemBaseModel<{}> = {
  name: 'Meteor Swords',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    playerBonusAttack: 2,
  },
  icon: {
    icon: 'dervish-swords',
  },
  bonusAbilities: [
    { spell: MeteorSpell, level: 1 },
  ],
  defaultState: {},
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem('Two large black swords with an astronomical map depicted in gold on the blade. Grants level 1 Meteor ability.'),
      ],
    };
  },
  config: {
    init: ({ actions, events, ownerPlayer }) => {
    },
  }
};
