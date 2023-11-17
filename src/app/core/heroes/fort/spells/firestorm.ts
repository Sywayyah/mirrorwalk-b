import { DamageType } from 'src/app/core/api/combat-api';
import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';


export const Firestorm = createSpell({
  name: 'Firestorm',
  icon: { icon: 'flaming-claw' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Deals 100 fire damage to target and converts 30% to pure damage. Your current unit is going to suffer 25% of that damage.`),
    ],
  }),
  type: {
    spellConfig: {
      getManaCost: () => 3,
      init({ events, actions, vfx }) {
        events.on({
          PlayerTargetsSpell({ target }) {
            actions.dealDamageTo(target, 70, DamageType.Fire);
            actions.dealDamageTo(target, 30, DamageType.Magic);

            actions.dealDamageTo(actions.getCurrentUnitGroup(), 30, DamageType.Fire);
          },
        })

      },
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
    }
  },
})
