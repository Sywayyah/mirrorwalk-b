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
    resistFire: 16,
    resistLightnining: 12,
  },
});
