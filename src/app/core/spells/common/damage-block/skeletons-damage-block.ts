import { Modifiers } from '../../../modifiers';
import { SpellBaseType } from '../../types';
import { createDamageBlockSpell } from '../base-spells/spell-damage-block';


export const SkeletonsDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = createDamageBlockSpell({
  name: 'Damage Block',
  icon: 'heavy-shield',
  blockConfig: {
    minDamage: [8, 35, 45, 86, 120],
    maxDamage: [16, 46, 55, 96, 160],
    chance: [0.5, 0.53, 0.56, 0.59, 0.62],
    chanceAgainstRange: [0.65, 0.68, 0.71, 0.74, 0.77],
  },
  description: ({ blockValue, meleeChance, rangedChance }) => `Skeletons can block ${blockValue} damage with ${meleeChance}% chance (${rangedChance}% against ranged units).`,
});
