import { spellDescrElem } from '../../ui';
import { UnitGroup } from '../../unit-types';
import { FrightAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { createSpell, debuffColors } from '../utils';

const damageDecreasePercent = 0.25;
const uiPercent = damageDecreasePercent * 100;

export const FrightSpellDebuff: SpellBaseType<{ frighter: UnitGroup }> = createSpell({
  id: '#spell-fright-debuff',

  name: 'Fright',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'batwings',
    ...debuffColors,
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(`This unit group is frightened, dealing ${uiPercent}% less damage to the one who scared it.`),
      ],
    };
  },
  config: {
    init({ actions, events, spellInstance, vfx, ownerHero }) {
      events.on({
        SpellPlacedOnUnitGroup({ target }) {
          const necromancyLevel = ownerHero.modGroup.getModValue('specialtyNecromancy') || 0;

          const reducedDamageCMod = actions.createModifiers({
            __attackConditionalModifiers(params) {
              if (!necromancyLevel) {
                if (params.attacked === spellInstance.state?.frighter) {
                  return {
                    baseDamagePercentModifier: -damageDecreasePercent,
                  };
                }
              }

              if (necromancyLevel >= 1) {
                if (params.attacked === spellInstance.state?.frighter) {
                  return { baseDamagePercentModifier: -0.25 };
                }

                if (params.attacked.modGroup.getModValue('isGhost')) {
                  return { baseDamagePercentModifier: -0.17 };
                }

                return { baseDamagePercentModifier: -0.12 };
              }

              return {};
            },
          });

          vfx.createEffectForUnitGroup(target, FrightAnimation, {
            duration: 1000,
          });
          actions.addModifiersToUnitGroup(target, reducedDamageCMod);
        },
      });
    },
  },
});

export const FrightSpell: SpellBaseType = createSpell({
  id: '#spell-fright',

  name: 'Fright',
  activationType: SpellActivationType.Passive,
  icon: {
    icon: 'batwings',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(
          `Scares enemy group on attack, reducing damage against this group by ${uiPercent}%.  Ability Improves with Necromancy, reducing damage against all your units.`,
        ),
      ],
    };
  },
  config: {
    init({ actions, events, ownerPlayer, ownerUnit }) {
      events.on({
        UnitGroupAttacks({ attacked, attacker }) {
          if (ownerUnit !== attacker) {
            return;
          }

          if (attacked.spells.find((spell) => spell.baseType === FrightSpellDebuff)) {
            return;
          }

          const frightSpellDebuff = actions.createSpellInstance(FrightSpellDebuff, { state: { frighter: attacker } });

          actions.addSpellToUnitGroup(attacked, frightSpellDebuff, ownerPlayer);
        },
      });
    },
  },
});
