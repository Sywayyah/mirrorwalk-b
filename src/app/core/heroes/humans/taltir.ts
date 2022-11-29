import { ItemWindCrest } from '../../items/neutral';
import { MeteorSpell } from '../../spells/common';
import { humansFraction } from '../../unit-types/humans';
import { HeroBase } from '../types';
import { createHeroModelBase, heroesDefaultResources } from '../utils';

export const TaltirHero: HeroBase = createHeroModelBase({
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
