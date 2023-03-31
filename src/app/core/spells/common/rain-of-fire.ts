import { DamageType } from '../../api/combat-api';
import { spellDescrElem } from '../../ui';
import { FireAnimation, getDamageParts } from '../../vfx';
import { SpellActivationType, SpellModel } from '../types';
import { canActivateOnEnemyFn } from '../utils';

const baseDamage = 65;

export const RainOfFireSpell: SpellModel = {
  name: 'Rain of Fire',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'fire',
  },
  getDescription({ ownerHero }) {
    return {
      descriptions: [
        spellDescrElem(`Deals ${baseDamage} (${ownerHero.level * baseDamage}) damage per each Hero Level to the target.`),
      ],
    }
  },
  type: {
    spellInfo: {
      name: 'Rain of Fire',
    },
    spellConfig: {
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
      init: ({ events, actions, thisSpell, ownerHero, vfx }) => {

        events.on({
          PlayerTargetsSpell(event) {

            vfx.createEffectForUnitGroup(event.target, FireAnimation, {
              duration: 850,
            });

            const damage = baseDamage * ownerHero.level;

            actions.dealDamageTo(
              event.target,
              damage,
              DamageType.Magic,
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
        const baseMana = 3;

        const manaCosts: Record<number, number> = {
          1: baseMana,
          2: baseMana + 1,
          3: baseMana + 1,
          4: baseMana + 2,
        };

        return manaCosts[spell.currentLevel];
      },
    },
  }
};
