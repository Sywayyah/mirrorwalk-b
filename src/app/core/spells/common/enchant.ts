import { EnchantAnimation } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellModel, SpellActivationType } from '../types';
import { debuffColors, canActivateOnEnemyFn } from '../utils';

export const EnchantBuff: SpellModel = {
  name: 'Enchanted',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'fire-ring',
    ...debuffColors,
  },
  description: 'Incoming magic damage is increased by 17%.',
  type: {
    spellInfo: {
      name: 'Enchanted',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: ({ events, actions, vfx }) => {
        const mods = actions.createModifiers({
          amplifiedTakenMagicDamage: 0.17
        });

        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: (event) => {
            vfx.createEffectForUnitGroup(event.target, EnchantAnimation, { duration: 1000 });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const EnchantSpell: SpellModel = {
  name: 'Enchant',
  icon: {
    // iconClr: 'rgb(235 142 178)',
    icon: 'fire-ring',
  },
  activationType: SpellActivationType.Target,
  description: 'Enchants an enemy, increases incoming magic damage by 17%.',
  type: {
    spellInfo: {
      name: 'Enchant',
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
            const enchantDebuff = actions.createSpellInstance(EnchantBuff);
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
            actions.historyLog('Enemy is enchanted');
          },
        });
      },
    },
  },
};
