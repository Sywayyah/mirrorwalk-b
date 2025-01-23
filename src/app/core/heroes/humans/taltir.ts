import { AssetsImages } from '../../assets';
import { humansFaction } from '../../factions';
import { IrtonPlateItem } from '../../items/neutral/irton-plate';
import { LightBootsItem } from '../../items/neutral/light-boots';
import { MeteorSpell } from '../../spells/common';
import { SummonFireSpiritsSpell } from '../../spells/common/summon-fire-spirits';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

/*
  Possible common spell: Valor. On being cast, increases stats of all units
  (or x random units initially).

  Pikeman might make Valor stronger.

  Some possible summons:
    Archangel
*/

const defaultAllResists = 12;

export const TaltirHero: HeroBase = humansFaction.createHero({
  id: '#hero-taltir',

  name: 'Taltir',
  // todo: maybe allow for custom descriptions
  generalDescription: heroDescrElem(`Taltir specializes at utilizing Fire Spells, summoning Fire Spirits and devastating Meteors. Knowledge in magic defenses makes him start with +${defaultAllResists}% to all resists.`),

  image: AssetsImages.HeroTaltir,
  abilities: [
    SummonFireSpiritsSpell,
    MeteorSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      ['#unit-h20', 6, 11, 2],
      ['#unit-h30', 3, 6, 2],
      ['#unit-h00', 25, 30, 1],
    ],
  }],
  items: [
    IrtonPlateItem,
    LightBootsItem,
    // FamineScytheItem,
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 14,
    baseAttack: 2,
    baseDefence: 2,
  },
  defaultModifiers: {
    resistAll: defaultAllResists,
  },
});
