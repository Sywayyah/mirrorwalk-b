import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { UnitGroup } from '../../unit-types';
import { CommonUtils } from '../../utils';
import { FireAnimation, getDamageParts, uiPercentSign } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnEnemyFn, createSpell, getLevelScalingValueFn } from '../utils';

const baseDamage = 65;
const bonusDmgPerLevel = 25;
const getDamageByLevel = getLevelScalingValueFn(baseDamage, bonusDmgPerLevel);

const baseManaCost = 3;

// make something special about first level:
//  Either make it reduce damage
//  or make it so that it starts with additional target, but reduce overall damage
const fireMasteryBonusesByLevels = [
  { targets: 1, damage: [0.3] },
  { targets: 1, damage: [0.6] },
  { targets: 2, damage: [0.65, 0.25] },
];

export const RainOfFireSpell: SpellBaseType = createSpell({
  id: '#spell-rain-of-fire',

  name: 'Rain of Fire',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'fire',
  },
  getDescription({ ownerHero, spellInstance }) {
    const fireMastery = ownerHero.specialtiesModGroup.getModValue('specialtyFireMastery') || 0;

    const descriptions = [
      spellDescrElem(`Deals ${baseDamage} base damage, +${bonusDmgPerLevel} per level to the target.`),
      spellDescrElem(`<br>Damage: ${getDamageByLevel(spellInstance.currentLevel)}`),
      spellDescrElem(`<br>Improves with Fire Mastery: gains random additional targets.`),
    ];

    if (fireMastery) {
      const fireMasteryBonuses = fireMasteryBonusesByLevels[fireMastery - 1];
      descriptions.push(
        spellDescrElem(
          `<hr/>Fire Mastery ${fireMastery}:<br>Additional targets: ${fireMasteryBonuses.targets}<br>Damage: ${fireMasteryBonuses.damage.map(uiPercentSign).join(', ')}`,
        ),
      );
    }

    return {
      descriptions,
    };
  },
  config: {
    targetCastConfig: {
      // can be changed to quicky test damage vs resists on your own units
      canActivate: canActivateOnEnemyFn,
    },
    init: ({ events, actions, thisSpell, ownerHero, vfx, spellInstance }) => {
      events.on({
        PlayerTargetsSpell(event) {
          const fullDamage = getDamageByLevel(spellInstance.currentLevel);

          function dealDamageToTarget(target: UnitGroup, damage: number, index: number): void {
            actions.dealDamageTo(target, damage, DamageType.Fire, (actionInfo) => {
              actions.historyLog(
                `${ownerHero.name} deals ${actionInfo.finalDamage} damage to ${actionInfo.initialUnitCount} ${target.type.name} with ${thisSpell.name}, ${actionInfo.unitLoss} units perish.`,
              );

              setTimeout(() => {
                vfx.createEffectForUnitGroup(target, FireAnimation, {
                  duration: 850,
                });

                vfx.createFloatingMessageForUnitGroup(
                  target,
                  getDamageParts(actionInfo.finalDamage, actionInfo.unitLoss),
                  { duration: 1200 },
                );
              }, index * 250);
            });
          }

          dealDamageToTarget(event.target, fullDamage, 0);

          // handle additional targets if fire mastery is present
          const fireMasteryLevel = ownerHero.specialtiesModGroup.getModValue('specialtyFireMastery') || 0;

          if (fireMasteryLevel) {
            const fireMasteryBonuses = fireMasteryBonusesByLevels[fireMasteryLevel - 1];

            const aliveEnemyUnits = actions.getAliveUnitGroupsOfPlayer(event.target.ownerPlayer);
            CommonUtils.removeItem(aliveEnemyUnits, event.target);

            if (aliveEnemyUnits.length) {
              const randomEnemies = CommonUtils.getRandomItems(aliveEnemyUnits, fireMasteryBonuses.targets);

              randomEnemies.forEach((additionalTarget, index) => {
                dealDamageToTarget(additionalTarget, fullDamage * fireMasteryBonuses.damage[index], index + 1);
              });
            }
          }
        },
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
        6: baseManaCost + 2,
        7: baseManaCost + 2,
      };

      return manaCosts[spell.currentLevel];
    },
  },
});
