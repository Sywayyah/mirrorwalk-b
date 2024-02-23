import { DamageType } from 'src/app/core/api/combat-api';
import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';


export const Firestorm = createSpell({
  id: '#spell-firestorm',

  name: 'Firestorm',
  icon: { icon: 'flaming-claw' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Deals 100 damage to the target as fire damage while converting 30% of it to pure damage. Your current unit is going to suffer 25% of that damage as fire damage.`),
    ],
  }),
  config: {
    spellConfig: {
      getManaCost: () => 3,
      init({ events, actions, vfx }) {
        events.on({
          PlayerTargetsSpell({ target }) {
            const baseDamage = 100;
            const targetFireDamage = baseDamage * 0.7;
            const targetMagicDamage = baseDamage - targetFireDamage;

            actions.dealDamageTo(target, targetFireDamage, DamageType.Fire);
            actions.dealDamageTo(target, targetMagicDamage, DamageType.Magic);

            actions.dealDamageTo(actions.getCurrentUnitGroup(), baseDamage * 0.25, DamageType.Fire);
            // actions.historyLog(``)
          },
        })

      },
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
    }
  },
})
