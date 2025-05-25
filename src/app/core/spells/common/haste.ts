import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem } from '../../ui';
import {
  createAnimation,
  getIconElement,
  getPlainAppearanceFrames,
  getPlainBlurFrames,
  getReversePulseKeyframes,
  messageWrapper,
} from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { buffColors, canActivateOnAllyFn, createSpell } from '../utils';

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
      mixBlendMode: 'hard-light',
    },
  ],
  [
    getIconElement(icon, 'fire-pulse'),
    getReversePulseKeyframes(),
    {
      ...commonStyles,
      opacity: '0.2',
      transform: 'translate(-50%, -50%) scale(1)',
      mixBlendMode: 'hard-light',
    },
  ],
]);

const speedBonus = 5;

export const HasteBuff: SpellBaseType = createSpell({
  id: '#spell-haste-buff',
  name: 'Haste',
  activationType: SpellActivationType.Buff,
  icon: {
    icon: icon,
    ...buffColors,
  },
  getDescription() {
    return {
      descriptions: [spellDescrElem(`Unit group is speeded up by ${speedBonus}.`)],
    };
  },
  config: {
    init: ({ events, actions, vfx, spellInstance }) => {
      const mods = actions.createModifiers({
        unitGroupSpeedBonus: speedBonus + spellInstance.currentLevel - 1,
      });

      events.on({
        SpellPlacedOnUnitGroup(event) {
          vfx.createEffectForUnitGroup(event.target, HasteAnimation, {
            duration: 800,
          });
          actions.addModifiersToUnitGroup(event.target, mods);
        },
      });
    },
  },
});

export const HasteSpell: SpellBaseType = createSpell({
  id: '#spell-haste',

  name: 'Haste',
  activationType: SpellActivationType.Target,
  icon: {
    icon: icon,
  },
  getDescription({ spellInstance }) {
    return {
      descriptions: [
        spellDescrElem(`Target unit group is speeding up by ${speedBonus + spellInstance.currentLevel - 1}.`),
        spellDescrElem(
          `When upgraded, increases the speed bonus and starts to grant a chance to gain additional turn to units.`,
        ),
      ],
    };
  },
  config: {
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
    isOncePerBattle: false,
    init: ({ events, actions, ownerPlayer, spellInstance, vfx }) => {
      events.on({
        PlayerTargetsSpell(event) {
          const hasteBuff = actions.createSpellInstance(HasteBuff, {
            initialLevel: spellInstance.currentLevel,
          });

          // type instead of id
          if (event.target.type.id === '#unit-neut-wind-spirit-0') {
            actions.addTurnsToUnitGroup(event.target, 1);

            vfx.createDroppingMessageForUnitGroup(
              event.target.id,
              {
                html: messageWrapper('+1 Turn'),
              },
              { duration: 1200 },
            );
          }

          actions.addSpellToUnitGroup(event.target, hasteBuff, ownerPlayer);
        },
      });
    },
  },
});
