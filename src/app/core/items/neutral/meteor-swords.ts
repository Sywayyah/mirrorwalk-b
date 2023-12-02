import { ItemBaseModel, ItemSlotType } from '..';
import { MeteorSpell } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';

export const ItemMeteorSwords: ItemBaseModel<{}> = {
  name: 'Meteor Swords',
  slotType: ItemSlotType.Weapon,
  icon: {
    icon: 'dervish-swords',
  },
  staticMods: {
    heroBonusAttack: 2,
    specialtyFireMastery: 1,
  },
  cost: {
    gold: 600,
  },
  bonusAbilities: [
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
  config: {
    init: ({ actions, events, ownerPlayer }) => {
    },
  }
};
