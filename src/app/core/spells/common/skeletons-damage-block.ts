import { Modifiers } from '../../modifiers';
import { spellDescrElem } from '../../ui';
import { uiPercent } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';

const blockConfigPerLevel = {
  minDamage: [12, 35, 45, 86, 120],
  maxDamage: [18, 46, 55, 96, 160],
  chance: [0.5, 0.53, 0.56, 0.59, 0.62],
  chanceAgainstRange: [0.65, 0.68, 0.71, 0.74, 0.77],
};

export const SkeletonsDamageBlock: SpellBaseType<{ damageBlockMod: Modifiers }> = {
  name: 'Damage Block',
  activationType: SpellActivationType.Passive,
  icon: {
    icon: 'heavy-shield',
  },
  getDescription({ ownerUnit, spellInstance }) {
    const level = spellInstance.currentLevel - 1;
    const minBlock = blockConfigPerLevel.minDamage[level];
    const maxBlock = blockConfigPerLevel.maxDamage[level];
    const meleeChance = uiPercent(blockConfigPerLevel.chance[level]);
    const rangedChance = uiPercent(blockConfigPerLevel.chanceAgainstRange[level]);
    return {
      descriptions: [
        spellDescrElem(`Skeletons can block ${minBlock}-${maxBlock} damage with ${meleeChance}% chance (${rangedChance}% against ranged units).`),
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
            attackConditionalModifiers({ attacker }) {
              const level = spellInstance.currentLevel - 1;
              const minBlock = blockConfigPerLevel.minDamage[level];
              const maxBlock = blockConfigPerLevel.maxDamage[level];

              if (attacker?.modGroup.getModValue('isRanged')) {

                return {
                  damageBlockMin: minBlock,
                  damageBlockMax: maxBlock,
                  chanceToBlock: blockConfigPerLevel.chanceAgainstRange[level],
                };
              }

              return {
                damageBlockMin: minBlock,
                damageBlockMax: maxBlock,
                chanceToBlock: blockConfigPerLevel.chance[level],
              };
            }
          } as Modifiers),
        };

        ownerUnit!.addSpellMods(spellInstance.state.damageBlockMod);
      },
      getManaCost() { return 0; },
      init() { },
    },
    spellInfo: {
      name: '',
    },
  },
};
