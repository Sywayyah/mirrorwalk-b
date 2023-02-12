import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { CommonUtils } from '../../unit-types';
import { createFireAnimation, getDamageParts } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellActivationType, SpellModel } from '../types';

const minDamage = 82;
const maxDamage = 124;

export const MeteorSpell: SpellModel = {
  name: 'Meteor',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'burning-meteor'
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Deals ${minDamage}-${maxDamage} magic damage to random enemy group`),
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
          1: 6,
          2: 7,
          3: 8,
          4: 9,
        };

        return manaCosts[spell.currentLevel];
      },

      init({ events, actions, thisSpell, ownerHero, vfx }) {
        events.on({
          [SpellEventTypes.PlayerCastsInstantSpell]: event => {
            const randomEnemyGroup = actions.getRandomEnemyPlayerGroup();

            const countBeforeDamage = randomEnemyGroup.count;

            vfx.createEffectForUnitGroup(
              randomEnemyGroup,
              createFireAnimation('burning-meteor'),
              { duration: 1000 },
            );

            actions.dealDamageTo(
              randomEnemyGroup,
              CommonUtils.randIntInRange(minDamage, maxDamage),
              DamageType.Magic,
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
