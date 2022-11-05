import { SpellActivationType, SpellEventTypes, SpellModel, UnitGroupInstModel } from "../../model";
import { Colors } from "../colors.const";
import { debuffColors } from "./utils";

export const FrightSpellDebuff: SpellModel<{ frighter: UnitGroupInstModel }> = {
  name: 'Fright',
  activationType: SpellActivationType.Debuff,
  description: 'This unit group is frightened, dealing 25% less damage to the one who scared it.',
  icon: {
    icon: 'batwings',
    ...debuffColors,
  },
  type: {
    spellInfo: {
      name: 'Fright',
    },
    spellConfig: {
      init({ actions, events, spellInstance }) {
        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]({ target }) {
            const reducedDamageCMod = actions.createModifiers({
              attackConditionalModifiers(params) {
                if (params.attacked === spellInstance.state?.frighter) {
                  return {
                    baseDamagePercentModifier: -0.25,
                  };
                }
                return {};
              }
            });

            actions.addModifiersToUnitGroup(target, reducedDamageCMod);
          },
        })
      },
      getManaCost(spellInst) {
        return 0;
      },
    },
  },
};

export const FrightSpell: SpellModel = {
  name: 'Fright',
  activationType: SpellActivationType.Passive,
  description: 'Scares enemy group on attack, reducing damage against this group by 25%.',
  icon: {
    icon: 'batwings',
  },
  type: {
    spellInfo: {
      name: 'Fright',
    },
    spellConfig: {
      init({ actions, events, ownerPlayer, ownerUnit }) {
        events.on({
          [SpellEventTypes.UnitGroupAttacks]({ attacked, attacker }) {
            if (ownerUnit !== attacker) {
              return;
            }

            if (attacked.spells.find(spell => spell.baseType === FrightSpellDebuff)) {
              return;
            }

            const frightSpellDebuff = actions.createSpellInstance(
              FrightSpellDebuff,
              { state: { frighter: attacker }, },
            );

            actions.addSpellToUnitGroup(attacked, frightSpellDebuff, ownerPlayer);
          },
        });
      },
      getManaCost(spellInst) {
        return 0;
      },
    },
  },
}
