import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

export const GarudaWindCrown: ItemBaseModel = {
  name: `Garuda's Wind Crown`,
  slotType: ItemSlotType.Headgear,

  staticMods: {
    heroBonusAttack: 3,
    heroBonusDefence: 6,
    resistAll: 10,
    unitGroupSpeedBonus: 3,
    cannotBeSlowed: true,
  },
  icon: {
    icon: 'feather-wing',
  },
  description({ thisItem }) {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem('An artefact of incredible strength.'),
      ],
    };
  },
  config: {
    init: ({
      actions, events, ownerPlayer,
    }) => {
    },
  },
}
