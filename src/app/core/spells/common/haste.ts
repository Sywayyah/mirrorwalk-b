import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem } from '../../ui';
import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getReversePulseKeyframes } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
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

const speedBonus = 5;


export const HasteBuff: SpellBaseType = {
  name: 'Haste',
  activationType: SpellActivationType.Buff,
  icon: {
    icon: icon,
    ...buffColors,
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(`Unit group is speeded up by ${speedBonus}.`),
      ],
    }
  },
  config: {
    spellConfig: {
      init: ({ events, actions, vfx }) => {
        const mods = actions.createModifiers({
          unitGroupSpeedBonus: speedBonus,
        });

        events.on({
          SpellPlacedOnUnitGroup(event) {
            vfx.createEffectForUnitGroup(event.target, HasteAnimation, { duration: 800 });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const HasteSpell: SpellBaseType = {
  name: 'Haste',
  activationType: SpellActivationType.Target,
  icon: {
    icon: icon,
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(`Target unit group is speeding up by ${speedBonus}.`),
        spellDescrElem(`When upgraded, increases the speed bonus and starts to grant a chance to gain additional turn to units.`),
      ],
    }
  },
  config: {
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
          PlayerTargetsSpell(event) {
            const enchantDebuff = actions.createSpellInstance(HasteBuff);
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
          },
        });
      },
    },
  },
};
