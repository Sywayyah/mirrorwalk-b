import { Modifiers } from '../../modifiers';
import { spellDescrElem } from '../../ui';
import { frontStackingBuffAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, debuffColors } from '../utils';

const slowingPercent = 50;
const spellIcon = 'player-despair';

export const KneelingLightDebuff: SpellBaseType = {
  name: 'Slowed',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: spellIcon,
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

            vfx.createEffectForUnitGroup(event.target, frontStackingBuffAnimation('player-despair', 'rgb(227, 240, 113)'), {
              duration: 1000,
            });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const KneelingLight: SpellBaseType = {
  name: 'Kneeling Light',
  icon: {
    // iconClr: 'rgb(235 142 178)',
    icon: spellIcon,
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
