import { DamageType } from '../../api/combat-api';
import { EffectAnimation } from '../../api/vfx-api';
import { spellDescrElem } from '../../ui';
import { CommonUtils } from '../../utils';
import { getDamageParts, simpleConvergentBuffAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { createSpell } from '../utils';

const minDmg = 20;
const maxDmg = 30;
const unitsCount = 2;

const FireBreathVfx: EffectAnimation = simpleConvergentBuffAnimation('dragon-breath');

export const FireBreath: SpellBaseType = createSpell({
  id: '#spell-fire-breath',

  name: 'Fire Breath',
  activationType: SpellActivationType.Passive,
  icon: {
    icon: 'dragon-breath',
  },
  getDescription({ ownerUnit }) {
    return {
      descriptions: [
        spellDescrElem(
          `${ownerUnit?.type.name} covers ground with fire breath at the beginning of each round, dealing ${minDmg}-${maxDmg} fire damage to ${unitsCount} random enemy groups.`,
        ),
      ],
    };
  },
  config: {
    init({ actions, vfx, ownerPlayer, ownerUnit, events, thisSpell }) {
      events.on({
        NewRoundBegins() {
          const enemyUntis = actions.getAliveUnitGroupsOfPlayer(actions.getEnemyOfPlayer(ownerPlayer));
          const randomUnits = CommonUtils.getRandomItems(enemyUntis, unitsCount);

          actions.historyLog(`${ownerUnit?.type.name} casts ${thisSpell.name}.`);
          randomUnits.forEach((unit) => {
            const damage = CommonUtils.randIntInRange(minDmg, maxDmg);

            vfx.createEffectForUnitGroup(unit, FireBreathVfx, {
              duration: 1300,
            });

            // can be extracted/reused somehow
            actions.dealDamageTo(unit, damage, DamageType.Fire, (actionInfo) => {
              actions.historyLog(
                `${ownerUnit?.type.name} deals ${actionInfo.finalDamage} damage to ${actionInfo.initialUnitCount} ${unit.type.name} with ${thisSpell.name}, ${actionInfo.unitLoss} units perish`,
              );

              vfx.createFloatingMessageForUnitGroup(unit, getDamageParts(actionInfo.finalDamage, actionInfo.unitLoss), {
                duration: 1800,
              });
            });
          });
        },
      });
    },
  },
});
