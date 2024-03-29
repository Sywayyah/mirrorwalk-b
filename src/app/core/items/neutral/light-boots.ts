import { ItemSlotType } from '../types';
import { createItem } from '../utils';

const speedBonus = 2;
const speedBonusUpgraded = speedBonus + 3;

export const LightBootsItem = createItem({
  id: '#item-light-boots',

  name: 'Light Boots',
  icon: 'boot-stomp',
  slot: ItemSlotType.Boots,
  cost: {
    gold: 425,
  },
  sellingCost: {
    gold: 200,
  },
  stats: {
    heroBonusDefence: 1,
    __unitConditionalMods(unit) {
      if (unit.type.level === 1) {
        if (unit.type.upgraded) {
          return {
            unitGroupSpeedBonus: speedBonusUpgraded,
          }
        }

        return {
          unitGroupSpeedBonus: speedBonus,
        };
      }

      return null;
    }
  },
  abilityDescription: `Increases speed of tier 1 units by ${speedBonus} (${speedBonusUpgraded} if unit is upgraded).`,
})
