import { itemStatsDescr, spellDescrElem } from '../../ui';
import { ItemBaseType, ItemSlotType } from '../types';
import { createItem } from '../utils';

const healValue = 50;

export const LifeformItem: ItemBaseType = createItem({
  id: '#item-lifeform',

  name: 'Lifeform',
  slot: ItemSlotType.Armor,
  icon: 'vest',
  stats: {
    heroBonusDefence: 7,
    resistFire: 25,
    resistPoison: 20,
    resistLightning: 15,
    resistCold: 15,
  },
  description({ thisItemBase }) {
    return {
      descriptions: [
        itemStatsDescr(thisItemBase),
        spellDescrElem(`An incredible artifact that shimmers with bright colors and emits life aura. Heals all units by ${healValue} in the beginning of each round.`),
      ],
    }
  },
  config: {
    init({ events, actions, ownerPlayer }) {
      events.on({
        NewRoundBegins: () => {
          const ownerUnitGroups = actions.getUnitGroupsOfPlayer(ownerPlayer);

          ownerUnitGroups.forEach((unitGroup) => {
            actions.healUnit(unitGroup, healValue);
          });
        },
      })
    }
  },
});
