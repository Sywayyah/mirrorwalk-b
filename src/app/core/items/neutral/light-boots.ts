import { ItemSlotType } from '../types';
import { createItem } from '../utils';

export const LightBootsItem = createItem({
  name: 'Light Boots',
  icon: 'boot-stomp',
  slot: ItemSlotType.Boots,
  stats: {
    heroBonusDefence: 1,
    __unitConditionalMods(unit) {
      if (unit.type.level === 1) {
        return {
          unitGroupSpeedBonus: 4,
        };
      }

      return null;
    }
  },
  abilityDescription: `Increases speed of tier 1 units by 4.`,
})
