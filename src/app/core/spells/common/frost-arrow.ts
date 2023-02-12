import { DamageType } from '../../api/combat-api';
import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem } from '../../ui';
import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getReversePulseKeyframes, getDamageParts } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellModel, SpellActivationType } from '../types';
import { debuffColors, canActivateOnEnemyFn } from '../utils';

const icon = 'frost-emblem';

const commonStyles = {
  fontSize: '64px',
  color: '#a9bee2',
};

export const FrozenAnimation: EffectAnimation = createAnimation([
  [
    getIconElement(icon, 'fire-main'),
    getPlainAppearanceFrames(),
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

const slow = 4;

export const FrozenArrowDebuff: SpellModel = {
  name: 'Freeze',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: icon,
    ...debuffColors,
    bgClr: '#a9bee2',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Unit group is slowed down by ${slow}.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Freeze',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: ({ events, actions, vfx, thisSpell }) => {
        const mods = actions.createModifiers({
          unitGroupSpeedBonus: -slow,
        });

        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: ({ target }) => {
            vfx.createEffectForUnitGroup(target, FrozenAnimation, { duration: 800 });
            actions.addModifiersToUnitGroup(target, mods);
            actions.historyLog(`${target.type.name} receives ${thisSpell.name} debuff and gets slowed by ${slow}.`);
          },
        })
      }
    }
  },
};

export const FrostArrowSpell: SpellModel = {
  name: 'Frost Arrow',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'frozen-arrow',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Deals 40 magic damage and slows enemy by ${slow}.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Frost Arrow',
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
          4: 3,
        };

        return manaCosts[spellInst.currentLevel];
      },

      init: ({ events, actions, ownerPlayer, ownerHero, thisSpell, vfx }) => {
        events.on({
          [SpellEventTypes.PlayerTargetsSpell]: (event) => {
            const enchantDebuff = actions.createSpellInstance(FrozenArrowDebuff);
            // not sure about ownerPlayer
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);

            actions.dealDamageTo(event.target, 40, DamageType.Magic, ({ finalDamage, unitLoss }) => {
              const unitTypeName = event.target.type.name;
              actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${unitTypeName} with ${thisSpell.name}, ${unitLoss} ${unitTypeName} perishes`)

              vfx.createFloatingMessageForUnitGroup(
                event.target,
                getDamageParts(finalDamage, unitLoss),
                { duration: 1000 },
              );
            });
          },
        });
      },
    },
  },
};
