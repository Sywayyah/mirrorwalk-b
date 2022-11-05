import { ItemBaseModel } from "../../model";
import { MeteorSpell } from "../spells";

export const ItemMeteorSwords: ItemBaseModel<{}> = {
  name: 'Meteor Swords',
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
  description: () => 'Two large black swords with an astronomical map depicted in gold on the blade. \n\n Gives +2 to attack and grants level 1 Meteor ability.',
  config: {
    init: ({ actions, events, ownerPlayer }) => {
    },
  }
};
