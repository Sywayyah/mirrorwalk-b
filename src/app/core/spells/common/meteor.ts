import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { CommonUtils } from '../../utils';
import { getDamageParts, messageWrapper, simpleConvergentBuffAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';

const minDamage = 82;
const maxDamage = 124;

const dmgIncrementPerLevel = 31;

/* todo: maybe change the bonus gained with level */
export const MeteorSpell: SpellBaseType = {
  name: 'Meteor',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'burning-meteor'
  },
  getDescription({ spellInstance }) {
    const damageBounsPerLevel = dmgIncrementPerLevel * spellInstance.currentLevel;

    return {
      descriptions: [
        spellDescrElem(`Meteor deals ${minDamage + damageBounsPerLevel}-${maxDamage + damageBounsPerLevel} fire damage to random enemy group, next 2 unit groups after current group in fight queue (enemies or allies) will be stunned and will lose their turns.`),
      ],
    }
  },
  config: {
    spellConfig: {
      getManaCost: (spell) => {
        const manaCosts: Record<number, number> = {
          1: 4,
          2: 5,
          3: 5,
          4: 6,
        };

        return manaCosts[spell.currentLevel];
      },

      init({ events, actions, thisSpell, ownerHero, vfx, spellInstance }) {
        events.on({
          PlayerCastsInstantSpell(event) {
            // todo: should stun happen after or before meteor damage?
            // todo: should all turns be gone or only 1? scaling?
            const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();
            const damageBounsPerLevel = dmgIncrementPerLevel * spellInstance.currentLevel;


            vfx.createEffectForUnitGroup(
              randomEnemyGroup,
              simpleConvergentBuffAnimation('burning-meteor'),
              { duration: 1000 },
            );

            actions.dealDamageTo(
              randomEnemyGroup,
              CommonUtils.randIntInRange(minDamage + damageBounsPerLevel, maxDamage + damageBounsPerLevel),
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
              actions.removeTurnsFromUnitGroup(unit);
              vfx.createDroppingMessageForUnitGroup(unit.id, { html: messageWrapper(`Stunned!`) });
            });
          },
        });
      },
    }
  }
}
