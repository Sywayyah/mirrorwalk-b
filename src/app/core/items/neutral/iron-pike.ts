import { ItemSlotType } from '../types';
import { createItem } from '../utils';

export const IronPikeItem = createItem({
  id: '#item-iron-pike',

  name: 'Iron Pike',
  icon: 'spear-head',
  slot: ItemSlotType.Weapon,
  cost: {
    gold: 420,
  },
  sellingCost: {
    gold: 250,
  },
  stats: {
    specialtyCombatTactics: 1,
    heroBonusAttack: 1,
  },
});
