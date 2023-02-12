import { ItemBaseModel, ItemSlotType } from '..';
import { FrostArrowSpell } from '../../spells/common';
import { itemStatsDescr, spellDescrElem } from '../../ui';

export const ItemIceBow: ItemBaseModel<{}> = {
  name: 'Ice Bow',
  slotType: ItemSlotType.Weapon,
  icon: {
    icon: 'frozen-arrow',
  },
  staticMods: {
    playerBonusAttack: 1,
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem('Bow which radiates cold, grants +1 to Attack and level 1 Frost Arrow'),
      ],
    };
  },
  bonusAbilities: [
    { level: 1, spell: FrostArrowSpell },
  ],
  defaultState: {},
  config: {
    init: () => { },
  }
};
