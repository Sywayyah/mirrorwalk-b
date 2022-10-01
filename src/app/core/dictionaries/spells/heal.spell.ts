import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";
import { EffectAnimation } from "../../model/vfx-api/vfx-api.types";
import { getHealParts } from "../../utils/utils";
import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getReversePulseKeyframes } from "../vfx/utils";
import { canActivateOnAllyFn } from "./utils";


const icon = 'hospital-cross';

const commonStyles = {
  fontSize: '64px',
  color: 'rgb(200 244 124)',
};

export const HealAnimation: EffectAnimation = createAnimation([
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


export const HealSpell: SpellModel = {
  name: 'Heal',
  icon: {
    icon: icon,
  },
  activationType: SpellActivationType.Target,
  description: 'Heals friendly unit by 10 per each unit in current group',
  type: {
    spellInfo: {
      name: 'Heal',
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

      init: ({ events, actions, ownerPlayer, ownerUnit, vfx }) => {
        events.on({
          [SpellEventTypes.PlayerTargetsSpell]: (event) => {

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

            vfx.createFloatingMessageForUnitGroup(
              event.target,
              getHealParts(healedCount, healValue),
              { duration: 1000 },
            );
          },
        });
      },
    },
  },
};
