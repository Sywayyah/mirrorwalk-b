import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { FireAnimation, getDamageParts } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, getLevelScalingValueFn } from '../utils';

const baseDamage = 65;
const bonusDmgPerLevel = 25;
const getDamageByLevel = getLevelScalingValueFn(baseDamage, bonusDmgPerLevel);

export const RainOfFireSpell: SpellBaseType = {
  name: 'Rain of Fire',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'fire',
  },
  getDescription({ ownerHero, spellInstance }) {
    return {
      descriptions: [
        spellDescrElem(`Deals ${baseDamage} +${bonusDmgPerLevel} damage per level (${getDamageByLevel(spellInstance.currentLevel)}) to the target.`),
        spellDescrElem(`<br>Improves with Fire Mastery: gains additional targets and damage.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Rain of Fire',
    },
    spellConfig: {
      targetCastConfig: {
        // can be changed to quicky test damage vs resists on your own units
        canActivate: canActivateOnEnemyFn,
      },
      init: ({ events, actions, thisSpell, ownerHero, vfx, spellInstance }) => {

        events.on({
          PlayerTargetsSpell(event) {

            vfx.createEffectForUnitGroup(event.target, FireAnimation, {
              duration: 850,
            });

            const damage = getDamageByLevel(spellInstance.currentLevel);

            actions.dealDamageTo(
              event.target,
              damage,
              DamageType.Fire,
              (actionInfo) => {
                actions.historyLog(`${ownerHero.name} deals ${actionInfo.finalDamage} damage to ${event.target.type.name} with ${thisSpell.name}`)

                vfx.createFloatingMessageForUnitGroup(
                  event.target,
                  getDamageParts(actionInfo.finalDamage, actionInfo.unitLoss),
                  { duration: 1000 },
                );
              },
            );
          }
        });

      },
      getManaCost: (spell) => {
        const baseMana = 2;

        // create utils for mana costs.
        const manaCosts: Record<number, number> = {
          1: baseMana,
          2: baseMana,
          3: baseMana + 1,
          4: baseMana + 1,
          5: baseMana + 2,
        };

        return manaCosts[spell.currentLevel];
      },
    },
  }
};
