import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { UnitGroup } from '../../unit-types';
import { CommonUtils } from '../../utils';
import { FireAnimation, getDamageParts, uiPercentSign } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, getLevelScalingValueFn } from '../utils';

const baseDamage = 65;
const bonusDmgPerLevel = 25;
const getDamageByLevel = getLevelScalingValueFn(baseDamage, bonusDmgPerLevel);

const baseManaCost = 3;

const fireMasteryBonusesByLevels = [
  { targets: 1, damage: [0.30] },
  { targets: 1, damage: [0.60] },
  { targets: 2, damage: [0.65, 0.25] },
];

export const RainOfFireSpell: SpellBaseType = {
  name: 'Rain of Fire',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'fire',
  },
  getDescription({ ownerHero, spellInstance }) {
    const fireMastery = ownerHero.specialtiesModGroup.getModValue('specialtyFireMastery') || 0;

    const descriptions = [
      spellDescrElem(`Deals ${baseDamage} +${bonusDmgPerLevel} damage per level (${getDamageByLevel(spellInstance.currentLevel)}) to the target.`),
      spellDescrElem(`<br>Improves with Fire Mastery: gains additional targets.`),
    ];

    if (fireMastery) {
      const fireMasteryBonuses = fireMasteryBonusesByLevels[fireMastery - 1];
      descriptions.push(spellDescrElem(`<hr/>Fire Mastery ${fireMastery}:<br>Additional targets: ${fireMasteryBonuses.targets}<br>Damage: ${fireMasteryBonuses.damage.map(uiPercentSign).join(', ')}`));
    }

    return {
      descriptions,
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

            const fullDamage = getDamageByLevel(spellInstance.currentLevel);

            function dealDamageToTarget(target: UnitGroup, damage: number): void {
              vfx.createEffectForUnitGroup(target, FireAnimation, {
                duration: 850,
              });

              actions.dealDamageTo(
                target,
                damage,
                DamageType.Fire,
                (actionInfo) => {
                  actions.historyLog(`${ownerHero.name} deals ${actionInfo.finalDamage} damage to ${actionInfo.initialUnitCount} ${target.type.name} with ${thisSpell.name}, ${actionInfo.unitLoss} units perish.`)

                  vfx.createFloatingMessageForUnitGroup(
                    target,
                    getDamageParts(actionInfo.finalDamage, actionInfo.unitLoss),
                    { duration: 1000 },
                  );
                },
              );
            }

            dealDamageToTarget(event.target, fullDamage);

            // handle additional targets if fire mastery is present
            const fireMasteryLevel = ownerHero.specialtiesModGroup.getModValue('specialtyFireMastery') || 0;

            if (fireMasteryLevel) {
              const fireMasteryBonuses = fireMasteryBonusesByLevels[fireMasteryLevel - 1];

              const aliveEnemyUnits = actions.getAliveUnitGroupsOfPlayer(event.target.ownerPlayerRef);
              CommonUtils.removeItem(aliveEnemyUnits, event.target);

              if (aliveEnemyUnits.length) {
                const randomEnemies = CommonUtils.getRandomItems(aliveEnemyUnits, fireMasteryBonuses.targets);

                randomEnemies.forEach((additionalTarget, index) => {
                  dealDamageToTarget(additionalTarget, fullDamage * fireMasteryBonuses.damage[index]);
                });
              }
            }

          }
        });
      },
      getManaCost: (spell) => {

        // create utils for mana costs.
        const manaCosts: Record<number, number> = {
          1: baseManaCost,
          2: baseManaCost,
          3: baseManaCost + 1,
          4: baseManaCost + 1,
          5: baseManaCost + 2,
        };

        return manaCosts[spell.currentLevel];
      },
    },
  }
};
