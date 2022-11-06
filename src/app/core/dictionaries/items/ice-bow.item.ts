import { ItemBaseModel } from "../../model";
import { FrostArrowSpell } from "../spells/frost-arrow";

export const ItemIceBow: ItemBaseModel<{}> = {
  name: 'Ice Bow',
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
