import { spellDescrElem } from '../../ui';
import { Modifiers } from '../../unit-types';
import { FrightAnimation, gainedDebuffAnimation } from '../../vfx';
import { SpellActivationType, SpellModel } from '../types';
import { canActivateOnEnemyFn, debuffColors } from '../utils';

const slowingPercent = 50;

export const KneelingLightDebuff: SpellModel = {
  name: 'Slowed',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'sunbeams',
    ...debuffColors,
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Unit group is slowed down by ${slowingPercent}%.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Slowed',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: ({ events, actions, vfx }) => {
        events.on({
          SpellPlacedOnUnitGroup(event) {
            const targetSpeed = event.target.type.baseStats.speed;

            const mods: Modifiers = actions.createModifiers({
              unitGroupSpeedBonus: -(targetSpeed * (slowingPercent / 100)),
            });

            vfx.createEffectForUnitGroup(event.target, gainedDebuffAnimation('sunbeams', 'rgb(219, 235, 169)'), {
              duration: 1000,
            });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const KneelingLight: SpellModel = {
  name: 'Kneeling Light',
  icon: {
    // iconClr: 'rgb(235 142 178)',
    icon: 'sunbeams',
  },

  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Makes light so heavy for the enemy target that it loses ${slowingPercent}% of the speed.`),
      ],
    }
  },
  activationType: SpellActivationType.Target,
  type: {
    spellInfo: {
      name: 'Kneeling light',
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

      init: ({ events, actions, ownerPlayer }) => {
        events.on({
          PlayerTargetsSpell(event) {
            const enchantDebuff = actions.createSpellInstance(KneelingLightDebuff);
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
          },
        });
      },
    },
  },
};
