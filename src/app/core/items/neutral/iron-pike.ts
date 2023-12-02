import { ItemSlotType } from '../types';
import { createItem } from '../utils';

export const IronPikeItem = createItem({
  name: 'Iron Pike',
  icon: 'spear-head',
  slot: ItemSlotType.Weapon,
  cost: {
    gold: 420,
  },
  stats: {
    specialtyCombatTactics: 1,
    heroBonusAttack: 1,
  },
});
