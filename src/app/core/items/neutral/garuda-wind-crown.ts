import { itemStatsDescr } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

export const GarudaWindCrown: ItemBaseModel = {
  name: `Garuda's Wind Crown`,
  slotType: ItemSlotType.Headgear,

  staticMods: {
    heroBonusAttack: 3,
    heroBonusDefence: 6,
    resistAll: 10,
    unitGroupSpeedBonus: 3,
    specialtyArchery: 2,
    cannotBeSlowed: true,
  },
  icon: {
    icon: 'feather-wing',
  },
  cost: {
    gold: 5000,
    redCrystals: 2,
    gems: 2,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
      ],
    };
  },
  config: {
    init: () => { },
  },
}
