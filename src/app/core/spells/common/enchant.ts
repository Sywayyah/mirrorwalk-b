import { spellDescrElem } from '../../ui';
import { EnchantAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, debuffColors } from '../utils';

const damageIncreasePercent = 17;

export const EnchantBuff: SpellBaseType = {
  name: 'Enchanted',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'fire-ring',
    ...debuffColors,
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(`Incoming magic damage is increased by ${damageIncreasePercent}%.`),
      ],
    }
  },
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
          amplifiedTakenMagicDamagePercent: damageIncreasePercent / 100,
        });

        events.on({
          SpellPlacedOnUnitGroup(event) {
            vfx.createEffectForUnitGroup(event.target, EnchantAnimation, { duration: 1000 });
            actions.addModifiersToUnitGroup(event.target, mods);
          },
        })
      }
    }
  },
};

export const EnchantSpell: SpellBaseType = {
  name: 'Enchant',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'fire-ring',
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(`Enchants an enemy to receive increased magic damage by ${damageIncreasePercent}%`),
      ],
    }
  },
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
          PlayerTargetsSpell(event) {
            const enchantDebuff = actions.createSpellInstance(EnchantBuff);
            actions.addSpellToUnitGroup(event.target, enchantDebuff, ownerPlayer);
            actions.historyLog('Enemy is enchanted');
          },
        });
      },
    },
  },
};
