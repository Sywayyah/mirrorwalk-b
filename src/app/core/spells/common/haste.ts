import { EffectAnimation } from '../../api/vfx-api';
import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getReversePulseKeyframes } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellModel, SpellActivationType } from '../types';
import { buffColors, canActivateOnAllyFn } from '../utils';

const icon = 'boot-stomp';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(200 244 124)',
};

const HasteAnimation: EffectAnimation = createAnimation([
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



export const HasteBuff: SpellModel = {
  name: 'Haste',
  activationType: SpellActivationType.Buff,
  icon: {
    icon: icon,
    ...buffColors,
  },
  description: 'Unit group is speeded up by 5.',
  type: {
    spellInfo: {
      name: 'Haste',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: ({ events, actions, vfx }) => {
        const mods = actions.createModifiers({
          unitGroupSpeedBonus: 5,
        });

        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: (event) => {
            vfx.createEffectForUnitGroup(event.target, HasteAnimation, { duration: 800 });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const HasteSpell: SpellModel = {
  name: 'Haste',
  icon: {
    icon: icon,
  },
  activationType: SpellActivationType.Target,
  description: 'Target unit group is speeding up by 5.',
  type: {
    spellInfo: {
      name: 'Haste',
    },
    spellConfig: {
      targetCastConfig: {
        canActivate: canActivateOnAllyFn,
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

      init: ({ events, actions, ownerPlayer }) => {
        events.on({
          [SpellEventTypes.PlayerTargetsSpell]: (event) => {
            const enchantDebuff = actions.createSpellInstance(HasteBuff);
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
          },
        });
      },
    },
  },
};
