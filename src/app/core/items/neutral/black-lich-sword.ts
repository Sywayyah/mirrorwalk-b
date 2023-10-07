import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const BlackLichSwordItem: ItemBaseModel = {
  name: 'Black Lich Sword',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 3,
    specialtyNecromancy: 1,
    heroBonusDefence: -2,
    heroMaxMana: -2,

    __unitConditionalMods(unitGroup) {
      if (unitGroup.type.level <= 4 && !unitGroup.modGroup.getModValue('isRanged')) {
        return {
          lifesteal: 10,
        };
      }

      return null;
    },
  },
  icon: {
    icon: 'bat-sword',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem(`Grants 10% Lifesteal to non-ranged units up to 4-th level.`),
      ],
    };
  },
  config: {
    init() { }
  },
};
