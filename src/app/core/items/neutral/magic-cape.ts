import { ItemSlotType } from '../types';
import { createItem } from '../utils';

export const MagicCapeItem = createItem({
  id: '#item-magic-cape',
  name: 'Magic Cape',
  slot: ItemSlotType.Armor,
  icon: 'hood',
  stats: {
    specialtyMagicRecovery: 1,
    heroBonusDefence: 2,
    heroMaxMana: 2,
  },
  cost: {
    gold: 300,
    wood: 1,
  },
  sellingCost: {
    gold: 100,
  },
});
