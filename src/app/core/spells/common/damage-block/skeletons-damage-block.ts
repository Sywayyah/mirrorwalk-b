import { Modifiers } from '../../../modifiers';
import { SpellBaseType } from '../../types';
import { createDamageBlockSpell } from '../base-spells/spell-damage-block';


export const SkeletonsDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = createDamageBlockSpell({
  name: 'Damage Block',
  icon: 'heavy-shield',
  blockConfig: {
    minDamage: [8, 24, 45, 86, 120],
    maxDamage: [16, 36, 55, 96, 160],
    chance: [0.20, 0.30, 0.35, 0.40, 0.45],
    chanceAgainstRange: [0.50, 0.65, 0.70, 0.75, 0.80],
  },
  description: ({ blockValue, meleeChance, rangedChance }) => `Skeletons can block ${blockValue} damage with ${meleeChance}% chance (${rangedChance}% against ranged units).`,
});
