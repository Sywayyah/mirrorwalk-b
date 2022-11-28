import { ItemWindCrest } from '../../items/neutral';
import { MeteorSpell } from '../../spells/common';
import { HUMANS_FRACTION_UNIT_TYPES } from '../../unit-types/humans';
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
      [HUMANS_FRACTION_UNIT_TYPES.Knights, 6, 11, 2],
      [HUMANS_FRACTION_UNIT_TYPES.Cavalry, 3, 6, 2],
      [HUMANS_FRACTION_UNIT_TYPES.Pikemans, 25, 30, 1],
    ],
  }],
  items: [ItemWindCrest],
  resources: heroesDefaultResources,
  stats: {
    mana: 14,
    baseAttack: 2,
  },
});
