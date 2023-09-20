import { Modifiers } from '../../../modifiers';
import { SpellBaseType } from '../../types';
import { createDamageBlockSpell } from '../base-spells/spell-damage-block';

export const DevastatorScaleArmorDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = createDamageBlockSpell({
  name: 'Scale Armor',
  icon: 'dragon-wing',
  blockConfig: {
    minDamage: [16],
    maxDamage: [26],
    chance: [0.45],
    chanceAgainstRange: [0.50],
  },
  description: ({ blockValue, meleeChance, rangedChance }) => `Sturdy scales of Devastator give a ${meleeChance}% chance to block ${blockValue} damage (${rangedChance}% against ranged units).`,
});
