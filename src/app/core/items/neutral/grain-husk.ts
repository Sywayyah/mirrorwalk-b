import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const GrainHuskItem: ItemBaseModel = {
  name: 'Grain Husk',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 2,
  },
  staticEnemyMods: {
    heroBonusDefence: -3,
    heroBonusAttack: -3,
    unitGroupSpeedBonus: -2,
  },
  icon: {
    icon: 'scythe',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
      ],
    };
  },
  config: {
    init() { }
  },
};
