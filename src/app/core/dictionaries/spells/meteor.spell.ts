import { DamageType } from "../../model/combat-api/combat-api.types";
import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";
import { getDamageParts } from "../../utils/utils";
import { createFireAnimation } from "../vfx/templates";

export const MeteorSpell: SpellModel = {
  name: 'Meteor',
  activationType: SpellActivationType.Instant,
  icon: {
    // iconClr: 'rgb(244 162 124)',

    icon: 'burning-meteor'
  },
  description: 'Deals 82 damage to random enemy group',

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
              82,
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
