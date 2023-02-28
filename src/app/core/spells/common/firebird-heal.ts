import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem, spellStatElem, spellStatsElem } from '../../ui';
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

/* Maybe make it ranged */
const healPerBird = 17;

export const FirebirdHealSpell: SpellModel = {
  name: 'Heal',
  activationType: SpellActivationType.Target,
  icon: {
    icon: icon,
  },
  getDescription(data) {
    const ownerUnit = data.ownerUnit!;

    const unitsCount = ownerUnit.count;

    const unitName = ownerUnit.type.name;

    const totalHeal = unitsCount * healPerBird;

    return {
      /* Think about description, maybe units abilities don't need stats descriptions */
      descriptions: [
        spellDescrElem(`Heals friendly unit group by ${totalHeal}. Heal increases by ${healPerBird} per each Firebird in current group.`),
        // spellStatsElem([
          // spellStatElem(`Total Heal:`, `${totalHeal} (${unitsCount} units)`),
          // spellStatElem(`Heal per Firebird:`, `${healPerBird}`),
          // `Total Heal: ${totalHeal} (${unitsCount} units)`,
          // `Heal per ${unitName}: ${healPerBird}`,
        // ]),
      ],
    }
  },
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
            const healedUnit = event.target;
            const healedUnitName = healedUnit.type.name;

            const healDetails = actions.healUnit(healedUnit, healValue);

            vfx.createEffectForUnitGroup(healedUnit, HealAnimation, { duration: 800 });


            const healedCount = healDetails.revivedUnitsCount;

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
