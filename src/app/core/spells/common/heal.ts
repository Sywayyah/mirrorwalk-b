import { EffectAnimation } from '../../api/vfx-api';
import {
  createAnimation,
  getHealParts,
  getIconElement,
  getPlainAppearanceFrames,
  getPlainBlurFrames,
  getReversePulseKeyframes,
} from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnAllyFn, createSpell } from '../utils';

const icon = 'hospital-cross';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(200 244 124)',
};

const HealAnimation: EffectAnimation = createAnimation('#vfx-heal', [
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

export const HealSpell: SpellBaseType = createSpell({
  id: '#spell-heal',

  name: 'Heal',
  activationType: SpellActivationType.Target,
  icon: {
    icon: icon,
  },
  getDescription(data) {
    return {
      descriptions: [],
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
    init: ({ events, actions, ownerPlayer, ownerUnit, vfx }) => {
      events.on({
        PlayerTargetsSpell(event) {
          const healValue = 64;
          const originalCount = event.target.count;
          const healedUnit = event.target;

          actions.healUnit(healedUnit, healValue);

          vfx.createEffectForUnitGroup(healedUnit, HealAnimation, { duration: 800 });

          const newCount = event.target.count;

          const healedUnitName = healedUnit.type.name;

          const healedCount = newCount - originalCount;

          actions.historyLog(`${ownerPlayer.hero.name} heals ${healedUnitName} by ${healValue}.`);
          actions.historyLog(`${healedCount} of ${healedUnitName} are brought back to life.`);

          vfx.createFloatingMessageForUnitGroup(event.target, getHealParts(healedCount, healValue), { duration: 1000 });
        },
      });
    },
  },
});
