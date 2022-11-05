import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model";
import { DamageType } from "../../model/combat-api/combat-api.types";
import { EffectAnimation } from "../../model/vfx-api/vfx-api.types";
import { getDamageParts } from "../../utils/utils";
import { Colors } from "../colors.const";
import { createAnimation, getIconElement, getPlainAppearanceFrames, getPlainBlurFrames, getReversePulseKeyframes } from "../vfx/utils";
import { canActivateOnEnemyFn } from "./utils";

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



export const FrozenArrowDebuff: SpellModel = {
  name: 'Freeze',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: icon,
    bgClr: '#a9bee2',
    iconClr: Colors.DefautlDebuffClr,
  },
  description: 'Unit group is slowed down by 4.',
  type: {
    spellInfo: {
      name: 'Freeze',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: ({ events, actions, vfx }) => {
        const mods = actions.createModifiers({
          unitGroupSpeedBonus: -4,
        });

        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: (event) => {
            vfx.createEffectForUnitGroup(event.target, FrozenAnimation, { duration: 800 });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const FrostArrowSpell: SpellModel = {
  name: 'Frost Arrow',
  icon: {
    icon: 'frozen-arrow',
  },
  activationType: SpellActivationType.Target,
  description: 'Deals 40 magic damage and slows enemy by 4.',
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
              actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${event.target.type.name} with ${thisSpell.name}`)

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
