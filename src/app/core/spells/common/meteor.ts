import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { CommonUtils } from '../../utils';
import { simpleConvergentBuffAnimation, getDamageParts } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';

const minDamage = 82;
const maxDamage = 124;

export const MeteorSpell: SpellBaseType = {
  name: 'Meteor',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'burning-meteor'
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Deals ${minDamage}-${maxDamage} fire damage to random enemy group`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Meteor',
    },
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

      init({ events, actions, thisSpell, ownerHero, vfx }) {
        events.on({
          PlayerCastsInstantSpell(event) {
            const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();

            const countBeforeDamage = randomEnemyGroup.count;

            vfx.createEffectForUnitGroup(
              randomEnemyGroup,
              simpleConvergentBuffAnimation('burning-meteor'),
              { duration: 1000 },
            );

            actions.dealDamageTo(
              randomEnemyGroup,
              CommonUtils.randIntInRange(minDamage, maxDamage),
              DamageType.Fire,
              ({ unitLoss, finalDamage }) => {
                actions.historyLog(`${ownerHero.name} deals ${finalDamage} damage to ${countBeforeDamage} ${randomEnemyGroup.type.name} with ${thisSpell.name}, ${unitLoss} units perish`);

                vfx.createFloatingMessageForUnitGroup(
                  randomEnemyGroup,
                  getDamageParts(finalDamage, unitLoss),
                  { duration: 1000 },
                );
              });
          },
        });
      },
    }
  }
}
