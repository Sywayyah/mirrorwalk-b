import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

const lifestealValue = 18;

export const BlackLichSwordItem: ItemBaseType = createItem({
  id: '#item-blacklich-sword',

  name: 'Black Lich Sword',
  icon: 'bat-sword',
  slot: ItemSlotType.Weapon,
  stats: {
    heroBonusAttack: 3,
    specialtyNecromancy: 1,
    heroManacostPenalty: 1,

    __unitConditionalMods(unitGroup) {
      if (unitGroup.type.level <= 4 && !unitGroup.modGroup.getModValue('isRanged')) {
        return {
          lifesteal: lifestealValue,
        };
      }

      return null;
    },
  },
  cost: {
    gold: 1000,
    gems: 1,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem(`Grants ${lifestealValue}% Lifesteal to non-ranged units up to level 4.`),
      ],
    };
  },
});
