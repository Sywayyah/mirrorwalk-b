// import { humansFraction } from '../core/fractions';
// import { PhoenixShieldItem } from '../core/items/neutral/phoenix-shield';

const humansFraction = window.mw.humansFraction;
//

humansFraction.createHero({
  name: 'Ironsight',
  abilities: [],
  army: [{
    minUnitGroups: 2,
    maxUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Archer'), 14, 16, 1],
      [humansFraction.getUnitType('Knight'), 8, 10, 1],
    ],
  }],
  items: [
    // PhoenixShieldItem,
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
  }
})
export const someValue = 5;
