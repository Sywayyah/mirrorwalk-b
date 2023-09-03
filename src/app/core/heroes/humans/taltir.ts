import { AssetsImages } from '../../assets';
import { humansFraction } from '../../fractions';
import { IrtonPlateItem } from '../../items/neutral/irton-plate';
import { LightBootsItem } from '../../items/neutral/light-boots';
import { MeteorSpell } from '../../spells/common';
import { SummonFireSpiritsSpell } from '../../spells/common/summon-fire-spirits';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

/*
  Possible common spell: Valor. On being casted, increases stats of all units
  (or x random units initially).

  Pikeman might make Valor stronger.

  Some possible summons:
    Archangel
*/

const defaultAllResists = 12;

export const TaltirHero: HeroBase = humansFraction.createHero({
  name: 'Taltir',
  // todo: maybe allow for custom descriptions
  generalDescription: heroDescrElem(`Taltir specializes at utilizing Fire Spells, summoning devastating Meteors and Fire Spirits. Knowledge in magic defenses makes him start with +${defaultAllResists}% to all resists.`),

  image: AssetsImages.HeroTaltir,
  abilities: [
    MeteorSpell,
    SummonFireSpiritsSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Knight'), 6, 11, 2],
      [humansFraction.getUnitType('Cavalry'), 3, 6, 2],
      [humansFraction.getUnitType('Pikemen'), 25, 30, 1],
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
