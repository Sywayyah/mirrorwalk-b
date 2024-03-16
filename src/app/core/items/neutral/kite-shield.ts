import { ItemSlotType } from '../types';
import { createItem } from '../utils';

// Possible idea: place debuff that reduces fire resist on enemies.
// or better add some modifier to enemy's global modifiers
export const KiteShieldItem = createItem({
  id: '#item-kite-shield',

  name: 'Kite Shield',
  icon: 'shield',
  slot: ItemSlotType.Shield,
  cost: {
    gold: 450,
  },
  sellingCost: {
    gold: 400,
  },
  stats: {
    __attackConditionalModifiers() {
      return {
        damageBlockMax: 14,
        damageBlockMin: 10,
        chanceToBlock: 1,
      };
    },
    heroBonusDefence: 1,
  },
  // attach it to enemy player when battle is started
  abilityDescription: `100% chance to block 10-14 damage`,
});
