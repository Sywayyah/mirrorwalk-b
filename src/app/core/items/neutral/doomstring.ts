import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseModel, ItemSlotType } from '../types';
import { createItem } from '../utils';

export const ItemDoomstring: ItemBaseModel = createItem({
  id: '#item-doomstring',

  name: 'Doomstring',
  slot: ItemSlotType.Weapon,
  icon: 'crossbow',
  stats: {
    heroBonusAttack: 8,
    specialtyOffence: 3,
    specialtyArchery: 2,
    specialtyFireMastery: 1,
  },
  cost: {
    gold: 5000,
    redCrystals: 2,
    gems: 1,
  },
  description: ({ thisItemBase }) => {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem(`An ancient ballista made in infernal abyss.`),
        spellDescrElem(`Grants ability: Doom. Doomed target looses 50% of armor and receives 50% increased physical damage.`),
      ],
    };
  },
});
