import { humansFraction } from '../../fractions';
import { ItemWindCrest } from '../../items/neutral';
import { HasteSpell, RainOfFireSpell } from '../../spells/common';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

export const HelveticaHero: HeroBase = humansFraction.createHero({
  name: 'Helvetica',
  abilities: [
    // ENCHANT_SPELL,
    RainOfFireSpell,
    // KneelingLight,
    HasteSpell,
    // HealSpell,
    // PoisonCloudSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Archer'), 12, 18, 1],
      [humansFraction.getUnitType('Knight'), 6, 11, 1],
      [humansFraction.getUnitType('Pikeman'), 20, 32, 1],
    ],
  }],
  items: [ItemWindCrest],
  resources: {
    ...heroesDefaultResources,
    wood: 4,
  },
  stats: {
    mana: 15,
    baseAttack: 1,
  },
});