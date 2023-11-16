import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';
import { messageWrapper } from 'src/app/core/vfx';


export const Firestorm = createSpell({
  name: 'Firestorm',
  icon: { icon: 'flaming-claw' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Deals 100 fire damage to target and converts 30% to pure damage. Your current unit is going to suffer 25% of that damage.`),
    ]
  }),
  type: {
    spellConfig: {
      getManaCost: () => 3,
      init({ events, actions, vfx }) {
        events.on({
          PlayerTargetsSpell({ target }) {
            vfx.createDroppingMessageForUnitGroup(target.id, { html: messageWrapper(`Stunned!`) });
          },
        })

      },
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
    }
  },
})
