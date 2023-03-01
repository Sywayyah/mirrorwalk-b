import { humansFraction } from '../../fractions';
import { ItemWindCrest } from '../../items/neutral';
import { IrtonPlateItem } from '../../items/neutral/irton-plate';
import { MeteorSpell, PoisonCloudSpell } from '../../spells/common';
import { SummonFireSpiritsSpell } from '../../spells/common/summon-fire-spirits';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';

export const TaltirHero: HeroBase = humansFraction.createHero({
  name: 'Taltir',
  generalDescription: heroDescrElem(`Taltir specializes at utilizing Fire Spells, summoning devastating Meteors and Fire Spirits that aid his army.`),

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
