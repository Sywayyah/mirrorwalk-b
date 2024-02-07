import { DamageType } from 'src/app/core/api/combat-api';
import { SpellActivationType, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';


export const LifeTransferSpell = createSpell({
  name: 'Life Transfer',
  icon: { icon: 'health-decrease' },
  activationType: SpellActivationType.Instant,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Reallocates health from enemies, dealing 20 damage to all enemies and equally distributing the dealt damage as healing among your army.`),
    ]
  }),
  config: {
    spellConfig: {
      getManaCost: () => 3,
      init({ events, actions, vfx, ownerPlayer, }) {
        events.on({
          PlayerCastsInstantSpell() {
            const enemyPlayer = actions.getEnemyOfPlayer(ownerPlayer);
            const aliveEnemies = actions.getAliveUnitGroupsOfPlayer(enemyPlayer);

            const initialEnemyCount = aliveEnemies.length;
            aliveEnemies.forEach((enemy) => {
              actions.dealDamageTo(enemy, 20, DamageType.Magic);
            });

            const totalHeal = initialEnemyCount * 20;
            const currentArmy = actions.getUnitGroupsOfPlayer(ownerPlayer);

            const healPerUnit = Math.round(totalHeal / currentArmy.length);

            currentArmy.forEach(unit => actions.healUnit(unit, healPerUnit));
          }
        })

      },
    }
  },
})
