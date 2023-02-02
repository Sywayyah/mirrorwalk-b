import { DamageType } from '../../api/combat-api';
import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { FireAnimation } from '../../vfx';
import { SpellEventTypes } from '../spell-events';
import { SpellActivationType, SpellModel } from '../types';
import { logDamage } from '../utils';

export const SummonFireSpiritsSpell: SpellModel = {
  activationType: SpellActivationType.Instant,
  description: 'Summons 4 Fire Spirits that fight on your side.',
  icon: {
    icon: 'aura',
  },
  name: 'Summon Fire Spirits',
  type: {
    spellConfig: {
      getManaCost() { return 3; },
      init({ actions, ownerHero, ownerPlayer, events, vfx, thisSpell }) {
        events.on({
          [SpellEventTypes.PlayerCastsInstantSpell]: () => {
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