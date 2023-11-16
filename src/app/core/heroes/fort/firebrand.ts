import { AssetsImages } from '../../assets';
import { fortFraction } from '../../fractions';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';
import { Firestorm } from './spells/firestorm';

export const FirebrandHero: HeroBase = fortFraction.createHero({
  name: 'Firebrand',
  generalDescription: heroDescrElem(`A troll who harnessed the chaotic nature of fire magic that causes destruction both to enemies and allies. Starts with -15% Fire Resist.`),

  image: AssetsImages.HeroKnight,
  abilities: [
    Firestorm,
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
    mana: 10,
    baseAttack: 2,
    baseDefence: 2,
  },
  defaultModifiers: {
    resistFire: -15,
  },
});
