import { humansFraction } from '../../fractions';
import { ItemWindCrest } from '../../items/neutral';
import { MeteorSpell, PoisonCloudSpell } from '../../spells/common';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

export const TaltirHero: HeroBase = humansFraction.createHero({
  name: 'Taltir',
  abilities: [
    MeteorSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Knight'), 6, 11, 2],
      [humansFraction.getUnitType('Cavalry'), 3, 6, 2],
      [humansFraction.getUnitType('Pikeman'), 25, 30, 1],
    ],
  }],
  items: [ItemWindCrest],
  resources: heroesDefaultResources,
  stats: {
    mana: 14,
    baseAttack: 2,
  },
});

/* Poison Assassin hero, might become a hero of Garden */
export const VeasinHero: HeroBase = humansFraction.createHero({
  name: 'Veasin',
  abilities: [
    PoisonCloudSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Knight'), 6, 11, 2],
      [humansFraction.getUnitType('Archer'), 6, 11, 2],
    ],
  }],
  items: [
    ItemWindCrest,
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 20,
    baseAttack: 1,
  },
});
