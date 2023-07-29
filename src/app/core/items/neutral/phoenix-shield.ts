import { ItemSlotType } from '../types';
import { createItem } from '../utils';

// Possible idea: place debuff that reduces fire resist on enemies.
// or better add some modifier to enemy's global modifiers
export const PhoenixShieldItem = createItem({
  name: 'Phoenix Shield',
  icon: 'fire-shield',
  slot: ItemSlotType.Shield,
  stats: {
    playerBonusDefence: 2,
    playerBonusAttack: 1,
    resistFire: 17,
  },
  // should it be attached to player? or commonMods?
  // looks more like player, and maybe then commonMods should also move to player.
  enemyStats: {
    resistFire: -12,
  },
});
