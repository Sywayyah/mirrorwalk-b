import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';

export const EssenceLeakDebuff = createSpell({
  activationType: SpellActivationType.Debuff,
  icon: { icon: 'implosion' },
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`When attacked, an attacker is being healed`),
    ]
  }),
  name: 'Life loss',
  type: {
    spellConfig: {
      getManaCost: () => 0,
      init() { },
      targetCastConfig: {
      }
    },
  },
});

export const EssenceLeak = createSpell({
  name: 'Essence Leak',
  icon: { icon: 'implosion' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(''),
    ]
  }),
  type: {
    spellConfig: {
      getManaCost: () => 2,
      init() { },
      targetCastConfig: { canActivate: canActivateOnEnemyFn }
    }
  },

});
