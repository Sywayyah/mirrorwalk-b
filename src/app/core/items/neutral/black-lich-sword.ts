import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

const lifestealValue = 18;

export const BlackLichSwordItem: ItemBaseModel = {
  name: 'Black Lich Sword',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 3,
    specialtyNecromancy: 1,

    __unitConditionalMods(unitGroup) {
      if (unitGroup.type.level <= 4 && !unitGroup.modGroup.getModValue('isRanged')) {
        return {
          lifesteal: lifestealValue,
        };
      }

      return null;
    },
  },
  icon: {
    icon: 'bat-sword',
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
  config: {
    init() { }
  },
};
