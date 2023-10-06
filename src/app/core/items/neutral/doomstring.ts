import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';

export const ItemDoomstring: ItemBaseModel<{}> = {
  name: 'Doomstring',
  slotType: ItemSlotType.Weapon,
  staticMods: {
    heroBonusAttack: 8,
    specialtyOffence: 3,
    specialtyArchery: 2,
    specialtyFireMastery: 1,
  },
  icon: {
    icon: 'crossbow',
  },
  defaultState: {},
  description: ({ thisItem }) => {
    return {
      descriptions: [
        itemStatsDescr(thisItem),
        spellDescrElem(`An ancient ballista made in infernal abyss.`),
        spellDescrElem(`Grants ability: Doom. Doomed target looses 50% of armor and receives 50% increased physical damage.`),
      ],
    };
  },
  config: {
    init: () => { },
  }
};
