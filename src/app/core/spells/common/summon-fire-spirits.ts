import { spellDescrElem } from '../../ui';
import { FireAnimation } from '../../vfx';
import { SpellActivationType, SpellBaseType } from '../types';
import { createSpell } from '../utils';
import { FireShieldSpell } from './fire-shield';

const unitCount = 3;
const unitGrowthPerLevel = 2;

// todo: despawn summoned spirits when fight ends
export const SummonFireSpiritsSpell: SpellBaseType = createSpell({
  id: '#spell-summon-fire-spirits',

  name: 'Fire Spirits',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'aura',
  },
  getDescription({ spellInstance }) {
    return {
      descriptions: [
        spellDescrElem(
          `Summon ${unitCount + unitGrowthPerLevel * spellInstance.currentLevel} Fire Spirits that fight on your side.`,
        ),
        spellDescrElem(`<hr/>Spirits have active ability Fire Shield and disappear when the fight is over.`),
      ],
    };
  },
  config: {
    getManaCost(thisSpell) {
      return 2 + thisSpell.currentLevel;
    },
    init({ actions, spellInstance, ownerPlayer, events, vfx }) {
      events.on({
        PlayerCastsInstantSpell() {
          const summonedUnitGroup = actions.summonUnitsForPlayer(
            ownerPlayer,
            '#unit-neut-fire-spirit-0',
            unitCount + unitGrowthPerLevel * spellInstance.currentLevel,
          );

          spellInstance.setCooldown(Infinity);

          const fireShieldSpell = actions.createSpellInstance(FireShieldSpell, { initialLevel: 1 });

          // add action maybe
          actions.addSpellToUnitGroup(summonedUnitGroup, fireShieldSpell, ownerPlayer);

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
      });
    },
  },
});
