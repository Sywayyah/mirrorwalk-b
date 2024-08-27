import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { CommonUtils } from '../../utils';
import { getDamageParts, messageWrapper, simpleConvergentBuffAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { createSpell } from '../utils';

const minDamage = 20;
const maxDamage = 50;

const dmgIncrementPerLevel = 25;

/* todo: maybe change the bonus gained with level */
export const MeteorSpell: SpellBaseType = createSpell({
  id: '#spell-meteor',
  name: 'Meteor',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'burning-meteor'
  },
  getDescription({ spellInstance }) {
    const damageBounsPerLevel = dmgIncrementPerLevel * spellInstance.currentLevel;

    return {
      descriptions: [
        spellDescrElem(`Meteor deals ${minDamage + damageBounsPerLevel}-${maxDamage + damageBounsPerLevel} fire damage to random enemy group, next 2 unit groups after current group in fight queue (enemies or allies) will be stunned and will lose their turns. If stunned enemy's creature is tier 4 or higher, instead of stun, it will take 65% of ability's damage.`),
      ],
    }
  },
  config: {
    spellConfig: {
      getManaCost: (spell) => {
        const manaCosts: Record<number, number> = {
          1: 5,
          2: 5,
          3: 6,
          4: 6,
        };

        return manaCosts[spell.currentLevel];
      },

      init({ events, actions, thisSpell, ownerHero, vfx, spellInstance }) {
        events.on({
          PlayerCastsInstantSpell(event) {
            // todo: should stun happen after or before meteor damage?
            // todo: should all turns be gone or only 1? scaling?
            // todo: if enemy is of high enough level - he isn't going to lose a turn
            // but is going to suffer 70% of Meteor's damage
            const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();
            const damageBounsPerLevel = dmgIncrementPerLevel * spellInstance.currentLevel;


            vfx.createEffectForUnitGroup(
              randomEnemyGroup,
              simpleConvergentBuffAnimation('burning-meteor'),
              { duration: 1000 },
            );

            const meteorDamage = CommonUtils.randIntInRange(minDamage + damageBounsPerLevel, maxDamage + damageBounsPerLevel);

            actions.dealDamageTo(
              randomEnemyGroup,
              meteorDamage,
              DamageType.Fire,
              ({ unitLoss, initialUnitCount, finalDamage }) => {
                actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${initialUnitCount} ${randomEnemyGroup.type.name} with ${thisSpell.name}, ${unitLoss} units perish`);

                vfx.createFloatingMessageForUnitGroup(
                  randomEnemyGroup,
                  getDamageParts(finalDamage, unitLoss),
                  { duration: 1000 },
                );
              });

            const unitsInQueue = actions.getUnitsFromFightQueue();
            const unitsToStun = CommonUtils.selectItems(unitsInQueue, 2, 1);
            console.log(unitsInQueue, unitsToStun);

            unitsToStun.forEach(unit => {
              // with leveling, it might have a different effect on creatures of higher level
              if (unit.type.level < 4) {
                actions.removeTurnsFromUnitGroup(unit);
                vfx.createDroppingMessageForUnitGroup(unit.id, { html: messageWrapper(`Stunned!`) });

                actions.historyLog(`${unit.count} ${unit.type.name} stunned by the Meteor.`);
              } else {
                if (actions.isEnemyUnitGroup(unit)) {
                  actions.dealDamageTo(unit, meteorDamage * 0.65, DamageType.Fire, ({ unitLoss, initialUnitCount, finalDamage }) => {

                    actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${initialUnitCount} ${randomEnemyGroup.type.name} with ${thisSpell.name}, ${unitLoss} units perish`);

                    vfx.createFloatingMessageForUnitGroup(
                      randomEnemyGroup,
                      getDamageParts(finalDamage, unitLoss),
                      { duration: 1000 },
                    );

                  });
                }
              }
            });
          },
        });
      },
    }
  }
})
