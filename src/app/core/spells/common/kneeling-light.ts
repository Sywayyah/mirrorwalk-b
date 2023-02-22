import { spellDescrElem } from '../../ui';
import { SpellEventTypes } from '../spell-events';
import { SpellActivationType, SpellModel } from '../types';
import { canActivateOnEnemyFn, debuffColors } from '../utils';

const slowingBy = 4;

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
        spellDescrElem(`Unit group is slowed down by ${slowingBy}.`),
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
        const mods = actions.createModifiers({
          unitGroupSpeedBonus: -slowingBy,
        });

        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: (event) => {
            // vfx.createEffectForUnitGroup(event.target, EnchantAnimation, { duration: 1000 });
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
        spellDescrElem(`Makes light so heavy for the enemy target that it loses ${slowingBy} speed.`),
      ],
    }
  },
  activationType: SpellActivationType.Target,
  description: `Makes light so heavy for the enemy target that it loses ${slowingBy} speed.`,
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
          [SpellEventTypes.PlayerTargetsSpell]: (event) => {
            const enchantDebuff = actions.createSpellInstance(KneelingLightDebuff);
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
          },
        });
      },
    },
  },
};
