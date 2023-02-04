import { ItemBaseModel, ItemType } from '..';
import { FrostArrowSpell } from '../../spells/common';

export const ItemIceBow: ItemBaseModel<{}> = {
  name: 'Ice Bow',
  type: ItemType.Weapon,
  description: () => 'Bow which radiates cold, grants +1 to Attack and level 1 Frost Arrow',
  icon: {
    icon: 'frozen-arrow',
  },
  staticMods: {
    playerBonusAttack: 1,
  },
  bonusAbilities: [
    { level: 1, spell: FrostArrowSpell },
  ],
  defaultState: {},
  config: {
    init: () => { },
  }
};
