import { Modifiers } from '../../../modifiers';
import { SpellBaseType } from '../../types';
import { createDamageBlockSpell, rangedChanceDescription } from '../base-spells/spell-damage-block';

export const KnightsDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = createDamageBlockSpell({
  name: 'Damage Block',
  icon: 'heavy-shield',
  blockConfig: {
    minDamage: [14, 22, 34, 45, 120],
    maxDamage: [20, 28, 42, 58, 160],
    chance: [0.60, 0.65, 0.70, 0.77, 0.68],
    chanceAgainstRange: [0.60, 0.65, 0.72, 0.80, 0.70],
  },
  description: ({ blockValue, meleeChance, rangedChance }) => `Knights can block ${blockValue} damage with ${meleeChance}% chance${rangedChanceDescription(meleeChance, rangedChance)}.`,
});
