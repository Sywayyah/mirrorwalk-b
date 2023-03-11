import { humansFraction } from '../../fractions';
import { ItemWindCrest } from '../../items/neutral';
import { HasteSpell, RainOfFireSpell } from '../../spells/common';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';

export const HelveticaHero: HeroBase = humansFraction.createHero({
  name: 'Helvetica',
  generalDescription: heroDescrElem(`Helvetica is the mage who supports her own army with offensive fire spells as well as increasing their speed.`),
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
    gems: 0,
    gold: 750,
    redCrystals: 0,
    wood: 4,
  },
  stats: {
    mana: 15,
    baseAttack: 1,
    baseDefence: 0,
  },
});
