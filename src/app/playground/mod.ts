import { humansFaction } from '../core/factions';
import { heroDescrElem } from '../core/ui';

humansFaction.createHero({
  id: '#hero-ironsight',
  name: 'Ironsight',
  generalDescription: heroDescrElem(`Ironsight makes great use of his increased combat stats and strong army.`),
  abilities: [],
  army: [
    {
      minUnitGroups: 2,
      maxUnitGroups: 2,
      units: [
        ['#unit-h10', 14, 16, 1],
        ['#unit-h20', 8, 10, 1],
      ],
    },
  ],
  items: [
    // PhoenixShieldItem,
    '#item-phoenix-shield',
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
  },
});
export const someValue = 5;
