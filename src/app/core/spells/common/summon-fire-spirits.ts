import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { spellDescrElem } from '../../ui';
import { FireAnimation } from '../../vfx';
import { SpellActivationType, SpellModel } from '../types';

export const SummonFireSpiritsSpell: SpellModel = {
  name: 'Summon Fire Spirits',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'aura',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(`Summons ${4} Fire Spirits that fight on your side.`),
      ],
    }
  },
  type: {
    spellConfig: {
      getManaCost() { return 3; },
      init({ actions, ownerHero, ownerPlayer, events, vfx, thisSpell }) {
        events.on({
          PlayerCastsInstantSpell() {
            const summonedUnitGroup = actions.summonUnitsForPlayer(ownerPlayer, neutralsFraction.getUnitType('FireSpirits'), 4);

            vfx.createEffectForUnitGroup(summonedUnitGroup, FireAnimation, { duration: 1000 });

            const enemyUnitGroups = actions.getAliveUnitGroupsOfPlayer(actions.getEnemyPlayer());

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
