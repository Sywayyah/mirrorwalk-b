import { AssetsImages } from '../../assets';
import { fortFraction } from '../../fractions';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

export const ToothpickHero: HeroBase = fortFraction.createHero({
  name: 'Toothpick',
  generalDescription: heroDescrElem(`Toothpick is a famous captain of Raiders, their effectiveness excels under his command.`),

  image: AssetsImages.HeroKnight,
  abilities: [
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [fortFraction.getUnitType('Raiders'), 16, 18, 1],
      [fortFraction.getUnitType('GoblinArcher'), 10, 10, 1],
    ],
  }],
  items: [
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 14,
    baseAttack: 2,
    baseDefence: 2,
  },
  defaultModifiers: {
  },
});
