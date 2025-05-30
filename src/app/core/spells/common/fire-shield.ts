import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem } from '../../ui';
import {
  createAnimation,
  getIconElement,
  getPlainAppearanceFrames,
  getPlainBlurFrames,
  getReversePulseKeyframes,
} from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { buffColors, canActivateOnAllyFn, createSpell } from '../utils';

const icon = 'fire-shield';

const commonStyles = {
  fontSize: '64px',
  color: '#ffbc6c',
};

const HasteAnimation: EffectAnimation = createAnimation('#vfx-haste', [
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

export const FireShieldBuff: SpellBaseType = createSpell({
  id: '#spell-fire-shield-buff',

  name: 'Fire Shield',
  activationType: SpellActivationType.Buff,
  icon: {
    icon: icon,
    ...buffColors,
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(
          `Unit is protected by Fire Shield, blocking 14-18 damage with 100% and receiving 15% Fire Resist.`,
        ),
      ],
    };
  },
  config: {
    isOncePerBattle: false,
    init: ({ events, actions, vfx }) => {
      // change it to non-conditional modifiers maybe
      const mods = actions.createModifiers({
        __attackConditionalModifiers() {
          return {
            chanceToBlock: 1,
            damageBlockMax: 18,
            damageBlockMin: 14,
            resistFire: 15,
          };
        },
      });

      events.on({
        SpellPlacedOnUnitGroup(event) {
          vfx.createEffectForUnitGroup(event.target, HasteAnimation, { duration: 800 });
          actions.addModifiersToUnitGroup(event.target, mods);
        },
      });
    },
  },
});

export const FireShieldSpell: SpellBaseType = createSpell({
  id: '#spell-fire-shield',

  name: 'Fire Shield',
  activationType: SpellActivationType.Target,
  icon: {
    icon: icon,
  },
  getDescription() {
    return {
      descriptions: [spellDescrElem(`Protects allied unit with a fire shield that blocks damage.`)],
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

    init: ({ events, actions, ownerPlayer, ownerUnit }) => {
      events.on({
        PlayerTargetsSpell(event) {
          const enchantDebuff = actions.createSpellInstance(FireShieldBuff);
          actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
        },
      });
    },
  },
});
