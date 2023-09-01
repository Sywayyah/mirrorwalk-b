import { AssetsImages } from '../../assets';
import { humansFraction } from '../../fractions';
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
export const HelveticaHero: HeroBase = humansFraction.createHero({
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
      [humansFraction.getUnitType('Archer'), 12, 18, 1],
      [humansFraction.getUnitType('Knight'), 6, 11, 1],
      [humansFraction.getUnitType('Pikemen'), 20, 32, 1],
    ],
  }],
  items: [
    // WishmasterItem,
    ItemWindCrest,
    // PhoenixShieldItem,
    // FamineScytheItem,
    // ItemIceBow,
  ],
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
  defaultModifiers: {
    specialtyFireMastery: 1,
  }
});
