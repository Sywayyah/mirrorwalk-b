import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';
import { messageWrapper } from 'src/app/core/vfx';


export const LifeObeliskSpell = createSpell({
  name: 'Life Obelisk',
  icon: { icon: 'arena' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Stuns selected target and summons an Obelisk with 100 health. Obelisk possesses aura that increases the armor by 4.`),
      spellDescrElem(`Obelisk cannot attack, but can be attacked and destroyed.`),
      spellDescrElem(`Some of Blight's abilities interact with obelisk.`),
      spellDescrElem(`Cannot be casted while there is another obelisk.`),
    ]
  }),
  config: {
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
