import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { spellDescrElem } from '../../ui';
import { FireAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';

const unitCount = 3;

// todo: despawn summoned spirits when fight ends
export const SummonFireSpiritsSpell: SpellBaseType = {
  name: 'Summon Fire Spirits',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'aura',
  },
  getDescription({ spellInstance }) {
    return {
      descriptions: [
        spellDescrElem(`Summons ${unitCount + spellInstance.currentLevel} Fire Spirits that fight on your side.`),
      ],
    }
  },
  type: {
    spellConfig: {
      getManaCost(thisSpell) { return 3 + thisSpell.currentLevel; },
      init({ actions, spellInstance, ownerPlayer, events, vfx }) {
        events.on({
          PlayerCastsInstantSpell() {
            const summonedUnitGroup = actions.summonUnitsForPlayer(ownerPlayer, neutralsFraction.getUnitType('FireSpirits'), unitCount + spellInstance.currentLevel);

            vfx.createEffectForUnitGroup(summonedUnitGroup, FireAnimation, { duration: 1000 });

            const enemyUnitGroups = actions.getAliveUnitGroupsOfPlayer(actions.getEnemyOfPlayer(ownerPlayer));

            // possible addition to spell: when Fire Spirits are summoned, all enemies receive 15
            // magical damage

            // enemyUnitGroups.forEach(unitGroup => {
            //   actions.dealDamageTo(unitGroup, 15, DamageType.Magic, (actionInfo) => {
            //     logDamage({
            //       actionInfo,
            //       actions,
            //       ownerHero,
            //       targetUnit: unitGroup,
            //       thisSpell,
            //       vfx
            //     })
            //   });

            //   vfx.createEffectForUnitGroup(unitGroup, FireAnimation, { duration: 1000 });
            // });

          },
        })
      },
    },
    spellInfo: {
      name: 'Summon Fire Spirits',
    }
  }
};
