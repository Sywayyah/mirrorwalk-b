

import { AssetsImages } from '../../assets';
import { humansFaction } from '../../factions';
import { ItemWindCrest } from '../../items/neutral';
import { PoisonCloudSpell } from '../../spells/common';
import { CorrosiveFogSpell } from '../../spells/common/corrosive-fog';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';

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
/*
  As much as I want Veasin to weaken enemies, Poison Cloud looks way to complicated
   for a starting skill in it's base form. I might split defence/attack lowering into
   a separate spell, like Corrosive Fog.

  And with that, Veasing is also going to have 2 starting spells.
*/
/*
  Another possible special treat of Veasin might be having lots of spells
    with unshared cooldowns / abilities with charges.
*/
export const VeasinHero: HeroBase = humansFaction.createHero({
  id: '#hero-veasin',

  name: 'Veasin',
  generalDescription: heroDescrElem(`Veasin makes use of her poison abilities, weakening enemies and dealing damage over time.`),
  image: AssetsImages.HeroMage,
  abilities: [
    PoisonCloudSpell,
    CorrosiveFogSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFaction.getUnitType('Cavalry'), 3, 5, 1],
      [humansFaction.getUnitType('Knight'), 6, 11, 1],
      [humansFaction.getUnitType('Halberdier'), 10, 18, 2],
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
    baseAttack: 4,
    baseDefence: 2,
  },
});
