import { humansFraction } from '../../fractions';
import { ItemWindCrest } from '../../items/neutral';
import { IrtonPlateItem } from '../../items/neutral/irton-plate';
import { MeteorSpell, PoisonCloudSpell } from '../../spells/common';
import { SummonFireSpiritsSpell } from '../../spells/common/summon-fire-spirits';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

export const TaltirHero: HeroBase = humansFraction.createHero({
  name: 'Taltir',
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
      [humansFraction.getUnitType('Pikeman'), 25, 30, 1],
    ],
  }],
  items: [IrtonPlateItem],
  resources: heroesDefaultResources,
  stats: {
    mana: 14,
    baseAttack: 2,
    baseDefence: 3,
  },
});

/* Poison Assassin hero, might become a hero of Garden */
export const VeasinHero: HeroBase = humansFraction.createHero({
  name: 'Veasin',
  abilities: [
    PoisonCloudSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [humansFraction.getUnitType('Knight'), 6, 11, 2],
      [humansFraction.getUnitType('Archer'), 6, 11, 2],
    ],
  }],
  items: [
    ItemWindCrest,
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 20,
    baseAttack: 1,
    baseDefence: 2,
  },
});
