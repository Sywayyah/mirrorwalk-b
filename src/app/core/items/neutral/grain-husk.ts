import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';


export const GrainHuskItem: ItemBaseModel = {
  name: 'Grain Husk',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    playerBonusAttack: 2,
  },
  staticEnemyMods: {
    playerBonusDefence: -3,
    playerBonusAttack: -3,
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
