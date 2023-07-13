import { ItemSlotType } from '../types';
import { createItem } from '../utils';

// Possible idea: place debuff that reduces fire resist on enemies.
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
