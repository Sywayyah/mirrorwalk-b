import { ItemSlotType } from '../types';
import { createItem } from '../utils';

// Possible idea: place debuff that reduces fire resist on enemies.
// or better add some modifier to enemy's global modifiers
export const PhoenixShieldItem = createItem({
  id: '#item-phoenix-shield',

  name: 'Phoenix Shield',
  icon: 'fire-shield',
  slot: ItemSlotType.Shield,
  cost: {
    gold: 750,
    gems: 1,
  },
  sellingCost: {
    gold: 400,
  },
  stats: {
    heroBonusDefence: 2,
    heroBonusAttack: 1,
    resistFire: 17,
  },
  // attach it to enemy player when battle is started
  enemyStats: {
    resistFire: -12,
  },
  abilityDescription: `Reduces enemy Fire Resistance by 12%`,
});
