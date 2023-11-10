import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
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
  type: {
    spellConfig: {
      getManaCost: () => 3,
      init({ events, actions, vfx, ownerPlayer }) {
        events.on({
          PlayerCastsInstantSpell() {
            const enemyPlayer = actions.getEnemyOfPlayer(ownerPlayer);
            const aliveEnemies = actions.getAliveUnitGroupsOfPlayer(enemyPlayer);
          }
        })

      },
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
    }
  },
})