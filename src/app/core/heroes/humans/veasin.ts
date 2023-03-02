

import { humansFraction } from '../../fractions';
import { ItemWindCrest } from '../../items/neutral';
import { PoisonCloudSpell } from '../../spells/common';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';


/* Poison Assassin hero, might become a hero of Garden */
/*  Poison cloud needs some improvements. It might weaken enemy's defence and attack, as well as deal some initial damage  */
/* There might be a new stat for heroes: Mysticism. Different abilities may gain different effects from it, and
  might be a rare stat to acquire (maybe a high-level hero with items can have 30 mysticism points)

  In theory.. there might be different mysticisms, like offensive/defensive.
*/

/*
  But also there can be branch-related specialties, like Fire Mastery, or Poison Mastery, or
  Astral Mastery.

  One spell may gain bonuses both from Mysticism and Fire Mastery, for instance, or
  maybe even from more masteries.

  There can be items that improve masteries, like Phoenix Shield may increase
  your Fire Mastery by 1.
*/
export const VeasinHero: HeroBase = humansFraction.createHero({
  name: 'Veasin',
  generalDescription: heroDescrElem(`Veasin makes use of her poison abilities, weakening enemies and dealing damage over time.`),
  abilities: [
    PoisonCloudSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Cavalry'), 3, 5, 1],
      [humansFraction.getUnitType('Knight'), 6, 11, 2],
      [humansFraction.getUnitType('Archer'), 6, 11, 1],
    ],
  }],
  items: [
    ItemWindCrest,
  ],
  resources: {
    gold: 1100,
    wood: 2,
    gems: 0,
    redCrystals: 0,
  },
  stats: {
    mana: 14,
    baseAttack: 2,
    baseDefence: 2,
  },
});
