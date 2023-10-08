import { Modifiers } from '../../../modifiers';
import { SpellBaseType } from '../../types';
import { createDamageBlockSpell, rangedChanceDescription } from '../base-spells/spell-damage-block';

export const DevastatorScaleArmorDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = createDamageBlockSpell({
  name: 'Scale Armor',
  icon: 'dragon-wing',
  blockConfig: {
    minDamage: [16],
    maxDamage: [24],
    chance: [0.25],
    chanceAgainstRange: [0.55],
  },
  description: ({ blockValue, meleeChance, rangedChance }) => `Sturdy scales of Devastator give a ${meleeChance}% chance to block ${blockValue} damage ${rangedChanceDescription(meleeChance, rangedChance)}.`,
});
