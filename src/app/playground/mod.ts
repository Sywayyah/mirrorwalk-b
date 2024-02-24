import { humansFaction } from '../core/factions';
import { PhoenixShieldItem } from '../core/items/neutral/phoenix-shield';
import { heroDescrElem } from '../core/ui';


humansFaction.createHero({
  id: '#hero-ironsight',
  name: 'Ironsight',
  generalDescription: heroDescrElem(`Ironsight makes great use of his increased combat stats and strong army.`),
  abilities: [],
  army: [{
    minUnitGroups: 2,
    maxUnitGroups: 2,
    units: [
      [humansFaction.getUnitType('Archer'), 14, 16, 1],
      [humansFaction.getUnitType('Knight'), 8, 10, 1],
    ],
  }],
  items: [
    PhoenixShieldItem,
  ],
  resources: {
    gold: 1250,
    gems: 0,
    redCrystals: 0,
    wood: 0,
  },
  stats: {
    baseAttack: 2,
    mana: 15,
    baseDefence: 1,
  }
})
export const someValue = 5;
