import { DamageType } from "src/app/core/api/combat-api";
import { createCrackedShieldAnimation } from "src/app/core/vfx/spells/cracked-shield";
import { AISpellTag, SpellActivationType } from "../../types";
import { createSpell } from "../../utils";

const crushAnimation = createCrackedShieldAnimation('red');

// idea: not every gnoll has to spawn with this ability.
// they can even get other bonus stats on random basis.
export const GnollCrushSpell = createSpell({
  id: '#spell-neut-gnoll-crush',
  name: 'Crush',
  icon: {
    icon: 'cracked-shield',
  },
  getDescription() {
    return { descriptions: ['Gnolls perform an attack with crushing force, reducing armor and attack of the victim by 2.'] };
  },
  activationType: SpellActivationType.Target,
  config: {
    aiTags: [AISpellTag.RegularAttackSpell],
    spellConfig: {

      init({ events, actions, ownerUnit, spellInstance, vfx }) {
        events.on({
          PlayerTargetsSpell({ target }) {
            spellInstance.setCooldown(1);
            // ownerUnit.spell
            actions.historyLog(`Group of Gnolls uses 'Crush' on group of ${target.type.name}`);
            // actions.removeTurnsFromUnitGroup(ownerUnit!, 1);
            // actions.unitGroupAttack(ownerUnit!, target);
            actions.dealDamageTo(target, 40, DamageType.PhysicalAttack);
            vfx.createEffectForUnitGroup(target, crushAnimation);

          }
        });
      }
    },
  },
});
