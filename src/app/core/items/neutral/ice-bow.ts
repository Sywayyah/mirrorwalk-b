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
    heroBonusAttack: 1,
    specialtyArchery: 1,
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem('Bow which radiates cold, grants level 1 Frost Arrow'),
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
