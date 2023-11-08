import { AssetsImages } from '../../assets';
import { fortFraction } from '../../fractions';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

export const BlightHero: HeroBase = fortFraction.createHero({
  name: 'Blight',
  generalDescription: heroDescrElem(`A rotting ent called Blight that weakens his own army by starting with -10% All Resist and -5 Defence, but compensating it with powerful abilities and providing many ways to heal your army.`),

  image: AssetsImages.HeroKnight,
  abilities: [
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [fortFraction.getUnitType('Raiders'), 13, 16, 2],
      [fortFraction.getUnitType('GoblinArcher'), 10, 14, 1],
    ],
  }],
  items: [
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 16,
    baseAttack: 2,
    baseDefence: 0,
  },
  defaultModifiers: {
    heroBonusDefence: -5,
    resistAll: -10,
  },
});
