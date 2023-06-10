import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem, strPercent } from '../../ui';
import { createAnimation, getIconElement, getPlainBlurFrames, getReversePulseKeyframes } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, debuffColors } from '../utils';

const damageReduction = 0.14;
const uiPercent = strPercent(damageReduction);

const defenceReduction = 5;

const roundsDuration = 2;

const icon = 'cracked-shield';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(220 145 129)',
};

const CorrosiveFogAnimation: EffectAnimation = createAnimation([
  [
    getIconElement(icon, 'fire-main'),
    [
      {
        opacity: '0',
        transform: 'translate(-50%, -50%) scale(0.8)',
      },
      {
        opacity: '1',
        offset: 0.25,
        transform: 'translate(-50%, -50%)  scale(1.2)',
      },
      {
        opacity: '1',
        offset: 0.35,
        transform: 'translate(-50%, -50%)  scale(1.6)',
      },
      {
        offset: 0.76,
        opacity: '0',
        transform: 'translate(-50%, -50%)  scale(1.9)',
      },
      {
        opacity: '0',
        transform: 'translate(-50%, -50%)  scale(2.1)',
      },
    ],
    {
      ...commonStyles,
      opacity: '1',
    },
  ],
  [
    getIconElement(icon, 'fire-blur'),
    getPlainBlurFrames(),
    {
      ...commonStyles,
      filter: 'blur(6px)',
      opacity: '1',
      mixBlendMode: 'hard-light'
    }
  ],
  [
    getIconElement(icon, 'fire-pulse'),
    getReversePulseKeyframes(),
    {
      ...commonStyles,
      opacity: '0.2',
      transform: 'translate(-50%, -50%) scale(1)',
      mixBlendMode: 'hard-light'
    },
  ]
]);


export const CorrosiveFogDebuff: SpellBaseType<undefined | { debuffRoundsLeft: number }> = {
  name: 'Corrosion',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'cracked-shield',
    ...debuffColors,
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Defence is lowered by ${defenceReduction}, damage by ${uiPercent}. Rounds left: ${data.spellInstance.state?.debuffRoundsLeft}.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Corrosion'
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },
      init({ events, actions, thisSpell, spellInstance, vfx }) {
        events.on({
          SpellPlacedOnUnitGroup({ target }) {
            const debuffData = {
              debuffRoundsLeft: roundsDuration,
            };
            spellInstance.state = debuffData;

            const modifiers = actions.createModifiers({
              baseDamagePercentModifier: -damageReduction,
              unitGroupBonusDefence: -defenceReduction,
            });

            vfx.createEffectForUnitGroup(target, CorrosiveFogAnimation);

            actions.addModifiersToUnitGroup(target, modifiers);

            actions.historyLog(`${target.type.name} gets negative effect "${thisSpell.name}"`);

            events.on({
              NewRoundBegins(event) {
                debuffData.debuffRoundsLeft--;

                if (!debuffData.debuffRoundsLeft) {
                  actions.removeSpellFromUnitGroup(target, spellInstance);
                  actions.removeModifiresFromUnitGroup(target, modifiers);
                }
              }
            });

          }
        });
      }
    }
  }
};

export const CorrosiveFogSpell: SpellBaseType = {
  name: 'Corrosive Fog',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'cracked-shield',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Surrounds an enemy with corrosive fog, reducing defence by ${defenceReduction} and outgoing damage by ${uiPercent}. Lasts ${roundsDuration} rounds.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Corrosive Fog',
    },
    spellConfig: {
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
      getManaCost(spellInst) {
        const manaCosts: Record<number, number> = {
          1: 2,
          2: 2,
          3: 3,
          4: 4,
        };

        return manaCosts[spellInst.currentLevel];
      },

      init({ events, actions, ownerPlayer, ownerHero, thisSpell }) {
        events.on({
          PlayerTargetsSpell(event) {
            actions.historyLog(`${ownerHero.name} casts "${thisSpell.name}" against ${event.target.type.name}`);

            const poisonDebuffInstance = actions.createSpellInstance(CorrosiveFogDebuff);

            actions.addSpellToUnitGroup(event.target, poisonDebuffInstance, ownerPlayer);
          }
        });
      }
    }
  }
};
