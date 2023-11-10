import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';
import { messageWrapper } from 'src/app/core/vfx';

export const OnslaughtBuffSpell = createSpell({
  name: 'Onslaught',
  icon: { icon: 'spear-head' },
  activationType: SpellActivationType.Buff,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Stats increased.`),
    ]
  }),
  type: {
    spellConfig: {
      getManaCost: () => 3,
      init({ events, actions, vfx }) {
        events.on({
          SpellPlacedOnUnitGroup({ target }) {
          },
        })
      },
    }
  },
})

export const OnslaugtSpell = createSpell({
  name: 'Onslaught',
  icon: { icon: 'spear-head' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Can only be casted on Raiders. Increases their stats and grants lifesteal.`),
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
        // adjust
        canActivate: ({ isEnemy, unitGroup }) => !isEnemy && unitGroup.type.name === 'Raiders',
      },
    }
  },
})
