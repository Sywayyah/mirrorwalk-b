import { ChargedStrikeSpell } from '../../spells/common/charged-strike';
import { ItemSlotType } from '../types';
import { createItem } from '../utils';

export const StormPikeItem = createItem({
  name: 'Storm Pike',
  icon: 'spear-head',
  slot: ItemSlotType.Weapon,
  cost: {
    gold: 750,
    // gems: 1,
  },
  abilityDescription: 'Grants ability Charged Strike that supplements unit attacks with lightning damage with additional effectiveness for any cavalry.',
  sellingCost: {
    gold: 340,
  },
  stats: {
    heroBonusAttack: 3,
  },
  spells: [{ level: 1, spell: ChargedStrikeSpell }],
});
