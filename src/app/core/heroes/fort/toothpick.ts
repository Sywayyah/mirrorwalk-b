import { AssetsImages } from '../../assets';
import { fortFaction } from '../../factions';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

// ability: Onset. Gives +40% lifesteal, 3 attack and 2 speed to Raiders. Later on also starts to grant additional turn.
export const ToothpickHero: HeroBase = fortFaction.createHero({
  id: '#hero-toothpick',

  name: 'Toothpick',
  generalDescription: heroDescrElem(`Toothpick is a famous captain of Raiders, their effectiveness excels under his command.`),

  image: AssetsImages.HeroKnight,
  abilities: [
    '#spell-onslaught'
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      ['#unit-f00', 16, 18, 1],
      ['#unit-f10', 10, 10, 1],
    ],
  }],
  items: [
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 10,
    baseAttack: 2,
    baseDefence: 2,
  },
  defaultModifiers: {
  },
});
