import { Modifiers } from 'src/app/core/modifiers';
import { spellDescrElem } from 'src/app/core/ui';
import { uiPercent, uiValueRange } from 'src/app/core/vfx';
import { SpellActivationType, SpellBaseType } from '../../types';

interface DamageBlockPerLevelConfig {
  minDamage: number[],
  maxDamage: number[],
  chance: number[],
  chanceAgainstRange: number[],
}

export const rangedChanceDescription = (meleeChance: string | number, rangedChance: string | number) =>
  meleeChance !== rangedChance ? ` (${rangedChance}% against ranged units)` : '';

export const createDamageBlockSpell = (config: {
  name: string,
  icon: string,
  blockConfig: DamageBlockPerLevelConfig,
  description: (data: { meleeChance: string, rangedChance: string, blockValue: string }) => string,
}): SpellBaseType<{ damageBlockMod: Modifiers }> => {
  const { icon, name, blockConfig, description } = config;
  return {
    name: name,
    activationType: SpellActivationType.Passive,
    icon: {
      icon: icon,
    },
    getDescription({ ownerUnit, spellInstance }) {
      const level = spellInstance.currentLevel - 1;

      const minBlock = blockConfig.minDamage[level];
      const maxBlock = blockConfig.maxDamage[level];
      const meleeChance = uiPercent(blockConfig.chance[level]);
      const rangedChance = uiPercent(blockConfig.chanceAgainstRange[level]);

      return {
        descriptions: [
          spellDescrElem(description({ meleeChance, rangedChance, blockValue: uiValueRange(minBlock, maxBlock) })),
        ]
      };
    },
    type: {
      spellConfig: {
        onAcquired({ ownerUnit, spellInstance }) {
          console.log('Aquired', spellInstance);
          if (spellInstance.state?.damageBlockMod) {
            ownerUnit!.removeSpellMods(spellInstance.state.damageBlockMod);
          }

          spellInstance.state = {
            damageBlockMod: ({
              __attackConditionalModifiers({ attacker }) {
                const level = spellInstance.currentLevel - 1;
                const minBlock = blockConfig.minDamage[level];
                const maxBlock = blockConfig.maxDamage[level];

                if (attacker?.modGroup.getModValue('isRanged')) {

                  return {
                    damageBlockMin: minBlock,
                    damageBlockMax: maxBlock,
                    chanceToBlock: blockConfig.chanceAgainstRange[level],
                  };
                }

                return {
                  damageBlockMin: minBlock,
                  damageBlockMax: maxBlock,
                  chanceToBlock: blockConfig.chance[level],
                };
              }
            } as Modifiers),
          };

          ownerUnit!.addSpellMods(spellInstance.state.damageBlockMod);
        },
        init() { },
      },
    },
  };
};
