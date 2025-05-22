import { SpellActivationType, canActivateOnEnemyFn, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';
import { frontStackingBuffAnimation } from 'src/app/core/vfx';

export const EssenceLeakDebuff = createSpell({
  id: '#spell-essence-leak-debuff',

  activationType: SpellActivationType.Debuff,
  icon: { icon: 'implosion' },
  getDescription: () => ({
    descriptions: [spellDescrElem(`Attacker will heal himself.`)],
  }),
  name: 'Life loss',
  config: {
    getManaCost: () => 0,
    init() {},
    targetCastConfig: {},
  },
});

export const EssenceLeak = createSpell({
  id: '#spell-essence-leak',

  name: 'Essence Leak',
  icon: { icon: 'implosion' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [
      spellDescrElem(
        'Places a curse on enemy. Any time target is attacked, the attacker will be healed by 1 point per each Sprite in the current group',
      ),
    ],
  }),
  config: {
    getManaCost: () => 2,
    init({ events, actions, ownerUnit, vfx }) {
      events.on({
        PlayerTargetsSpell({ target }) {
          const essenceLeakDebuff = actions.createSpellInstance(EssenceLeakDebuff, { initialLevel: 1 });

          target.addSpell(essenceLeakDebuff);
          vfx.createEffectForUnitGroup(target, frontStackingBuffAnimation('implosion', 'rgb(223 165 255)'), {
            duration: 1000,
          });
        },
      });
    },
    targetCastConfig: { canActivate: canActivateOnEnemyFn },
  },
});
