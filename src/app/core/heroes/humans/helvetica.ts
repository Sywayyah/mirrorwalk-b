import { AssetsImages } from '../../assets';
import { humansFaction } from '../../factions';
import { ItemWindCrest } from '../../items/neutral';
import { HasteSpell, RainOfFireSpell } from '../../spells/common';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';

/*
  Ideas: Crystal Illness: gain 1 mana, but lose 1 armor.
  This might be a passive ability (each round), or active (but cooldown doesn't affect other spells)

  Mages might posses 2 initial skills, 1 of which will
    always be available, like:
      Shock
      Rain of Fire
*/
export const HelveticaHero: HeroBase = humansFaction.createHero({
  id: '#hero-helvetica',

  name: 'Helvetica',
  generalDescription: heroDescrElem(`Helvetica is the mage who supports her own army with offensive fire spells as well as increasing their speed.`),
  image: AssetsImages.HeroHelvetica,
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
      ['#unit-h00', 20, 32, 1],
      ['#unit-h10', 12, 18, 1],
      ['#unit-h20', 6, 11, 1],
      ['#unit-neut-wind-spirit-0', 4, 6, 1],
    ],
  }],
  items: [
    // WishmasterItem,
    ItemWindCrest,
    // SwordOfTheBattleMageItem,
    // PhoenixShieldItem,
    // FamineScytheItem,
    // FlamingSword,
    // ItemIceBow,
  ],
  resources: {
    gems: 0,
    gold: 750,
    redCrystals: 0,
    wood: 4,
  },
  stats: {
    mana: 12,
    baseAttack: 1,
    baseDefence: 0,
  },
  defaultModifiers: {
    // specialtyFireMastery: 1,
  }
});
