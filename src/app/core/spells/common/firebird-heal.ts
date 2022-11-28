import { EffectAnimation } from '../../api/vfx-api';
import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getReversePulseKeyframes, getHealParts } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellModel, SpellActivationType } from '../types';
import { canActivateOnAllyFn } from '../utils';

const icon = 'hospital-cross';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(200 244 124)',
};

const HealAnimation: EffectAnimation = createAnimation([
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

const healPerBird = 13;

export const FirebirdHealSpell: SpellModel = {
  name: 'Heal',
  icon: {
    icon: icon,
  },
  activationType: SpellActivationType.Target,
  description: `Heals friendly unit by ${healPerBird} per each Firebird in current group.`,
  type: {
    spellInfo: {
      name: 'Heal',
    },
    spellConfig: {
      targetCastConfig: {
        canActivate: canActivateOnAllyFn,
      },
      getManaCost(spellInst) {
        return 4;
      },

      init: ({ events, actions, ownerUnit, vfx }) => {
        events.on({
          [SpellEventTypes.PlayerTargetsSpell]: (event) => {
            const casterUnit = ownerUnit!;

            const healValue = casterUnit.count * healPerBird;
            const originalCount = event.target.count;
            const healedUnit = event.target;


            actions.healUnit(healedUnit, healValue);

            vfx.createEffectForUnitGroup(healedUnit, HealAnimation, { duration: 800 });

            const newCount = event.target.count;

            const healedUnitName = healedUnit.type.name;

            const healedCount = newCount - originalCount;

            actions.historyLog(`${casterUnit.count} ${casterUnit.type.name} heal ${healedUnitName} by ${healValue}.`);
            actions.historyLog(`${healedCount} of ${healedUnitName} are brought back to life.`);

            vfx.createFloatingMessageForUnitGroup(
              event.target,
              getHealParts(healedCount, healValue),
              { duration: 1600 },
            );
          },
        });
      },
    },
  },
};
