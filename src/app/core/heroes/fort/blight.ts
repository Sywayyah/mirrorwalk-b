import { AssetsImages } from '../../assets';
import { fortFraction } from '../../fractions';
import { heroDescrElem } from '../../ui';
import { HeroBase } from '../types';
import { heroesDefaultResources } from '../utils';
import { LifeTransferSpell } from './spells/life-transfer';
import { LifeObeliskSpell } from './spells/obelisk';

// Abilities: Life totem. Targeted. Deals small damage to the target and summons a Life totem unit. It gives armor to your units via aura
//  and heals everyone by small amount. With upgrading, it gains a chance to Stun enemy and makes them loose 1 turn.
//  this ability cannot be cast again until there is alive Life totem.

// Life tansfer: Reallocates health from your enemies to your army, dealing 15 damage to everyone and equally distributing the total damage as healing.
//  When life totem is present on the battlefield, effect of this ability is increased by 30%.
export const BlightHero: HeroBase = fortFraction.createHero({
  name: 'Blight',
  generalDescription: heroDescrElem(`A rotting ent called Blight. His army is weakened by -10% All Resist and -5 Defence, but compensating it with abilities and providing many ways to heal.`),

  image: AssetsImages.HeroKnight,
  abilities: [
    LifeObeliskSpell,
    LifeTransferSpell,
  ],
  army: [{
    maxUnitGroups: 2,
    minUnitGroups: 2,
    units: [
      [fortFraction.getUnitType('Raiders'), 13, 16, 2],
      [fortFraction.getUnitType('GoblinArcher'), 10, 14, 1],
    ],
  }],
  items: [
  ],
  resources: heroesDefaultResources,
  stats: {
    mana: 16,
    baseAttack: 2,
    baseDefence: 0,
  },
  defaultModifiers: {
    heroBonusDefence: -5,
    resistAll: -10,
  },
});
