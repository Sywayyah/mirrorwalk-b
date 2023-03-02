import { DamageType } from '../../api/combat-api';
import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem, strPercent } from '../../ui';
import { createAnimation, getDamageParts, getIconElement, getPlainBlurFrames, getReversePulseKeyframes } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellActivationType, SpellModel } from '../types';
import { canActivateOnEnemyFn, debuffColors } from '../utils';

const damageReduction = 0.14;
const uiPercent = strPercent(damageReduction);

const defenceReduction = 5;

const intervalDamage = 30;

const minInitDamage = 30;
const maxInitDamage = 45;

const roundsDuration = 2;


const icon = 'bomb-explosion';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(200 244 124)',
};

const PoisonCloudAnimation: EffectAnimation = createAnimation([
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


export const PoisonCloudDebuff: SpellModel<undefined | { debuffRoundsLeft: number }> = {
  name: 'Poisoned',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'poison-cloud',
    ...debuffColors,
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Defence is lowered by ${defenceReduction}, damage by ${uiPercent} and takes ${intervalDamage} damage at the beginning of next round. Rounds left: ${data.spellInstance.state?.debuffRoundsLeft}.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Poisoned'
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },
      init({ events, actions, thisSpell, spellInstance, vfx }) {
        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: ({ target }) => {
            const debuffData = {
              debuffRoundsLeft: roundsDuration,
            };
            spellInstance.state = debuffData;

            const modifiers = actions.createModifiers({
              // baseDamagePercentModifier: -damageReduction,
              unitGroupBonusDefence: -defenceReduction,
            });

            vfx.createEffectForUnitGroup(target, PoisonCloudAnimation);

            actions.addModifiersToUnitGroup(target, modifiers);

            actions.historyLog(`${target.type.name} gets negative effect "${thisSpell.name}"`);

            events.on({
              [SpellEventTypes.NewRoundBegins]: (event) => {

                actions.dealDamageTo(target, intervalDamage, DamageType.Magic, (damageInfo) => {
                  actions.historyLog(`Poison deals ${damageInfo.finalDamage} damage to ${target.type.name}, ${damageInfo.unitLoss} units perish`);

                  vfx.createEffectForUnitGroup(target, PoisonCloudAnimation);

                  vfx.createFloatingMessageForUnitGroup(
                    target,
                    getDamageParts(damageInfo.finalDamage, damageInfo.unitLoss),
                    { duration: 1000 },
                  );
                });

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

export const PoisonCloudSpell: SpellModel = {
  name: 'Poison Cloud',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'poison-cloud',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Poisons target, reduces defence by ${defenceReduction} and damage by ${uiPercent}. At the beginning of each round, target takes ${intervalDamage} damage. Lasts 2 rounds.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Poison Cloud',
    },
    spellConfig: {
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
      getManaCost(spellInst) {
        const manaCosts: Record<number, number> = {
          1: 3,
          2: 3,
          3: 4,
          4: 5,
        };

        return manaCosts[spellInst.currentLevel];
      },

      init({ events, actions, ownerPlayer, ownerHero, thisSpell }) {
        events.on({
          [SpellEventTypes.PlayerTargetsSpell]: event => {
            actions.historyLog(`${ownerHero.name} casts "${thisSpell.name}" against ${event.target.type.name}`);

            const poisonDebuffInstance = actions.createSpellInstance(PoisonCloudDebuff);

            actions.addSpellToUnitGroup(event.target, poisonDebuffInstance, ownerPlayer);
          }
        });
      }
    }
  }
};
