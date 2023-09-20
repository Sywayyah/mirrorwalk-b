import { Modifiers } from '../../../modifiers';
import { SpellBaseType } from '../../types';
import { createDamageBlockSpell } from '../base-spells/spell-damage-block';

export const KnightsDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = createDamageBlockSpell({
  name: 'Damage Block',
  icon: 'heavy-shield',
  blockConfig: {
    minDamage: [14, 22, 34, 45, 120],
    maxDamage: [20, 28, 42, 58, 160],
    chance: [0.60, 0.62, 0.64, 0.66, 0.68],
    chanceAgainstRange: [0.63, 0.65, 0.67, 0.68, 0.70],
  },
  description: ({ blockValue, meleeChance, rangedChance }) => `Knigts can block ${blockValue} damage with ${meleeChance}% chance (${rangedChance}% against ranged units).`,
});
