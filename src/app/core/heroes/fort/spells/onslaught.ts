import { ModifiersModel } from 'src/app/core/modifiers';
import { SpellActivationType, createSpell } from 'src/app/core/spells';
import { spellDescrElem } from 'src/app/core/ui';
import { frontStackingBuffAnimation } from 'src/app/core/vfx';

// it can be funny to have only basic Raiders affected by this spell, and maybe
// advanced version when at higher levels
export const OnslaughtBuffSpell = createSpell<{ mods: ModifiersModel }>({
  id: '#spell-onslaught-buff',

  name: 'Onslaught',
  icon: { icon: 'spear-head', bgClr: 'orange', iconClr: '#f10c0c' },
  activationType: SpellActivationType.Buff,
  getDescription: () => ({
    descriptions: [spellDescrElem(`This group of Raiders has increased stats and 40% lifesteal.`)],
  }),
  config: {
    getManaCost: () => 3,
    init({ events, actions, vfx }) {
      const modifiers = actions.createModifiers({
        lifesteal: 40,
        heroBonusAttack: 3,
        heroBonusDefence: 2,
      });

      events.on({
        SpellPlacedOnUnitGroup({ target }) {
          actions.addModifiersToUnitGroup(target, modifiers);
        },
      });
    },
  },
});

export const OnslaugtSpell = createSpell({
  id: '#spell-onslaught',
  name: 'Onslaught',
  icon: { icon: 'spear-head' },
  activationType: SpellActivationType.Target,
  getDescription: () => ({
    descriptions: [spellDescrElem(`Can only be cast on Raiders. Increases their stats and grants lifesteal.`)],
  }),
  config: {
    getManaCost: () => 1,
    init({ events, actions, vfx, ownerPlayer }) {
      events.on({
        PlayerTargetsSpell({ target }) {
          vfx.createEffectForUnitGroup(target, frontStackingBuffAnimation('spear-head', 'orange'));

          const onslaughtBuff = actions.createSpellInstance(OnslaughtBuffSpell, { initialLevel: 1 });

          actions.addSpellToUnitGroup(target, onslaughtBuff, ownerPlayer);
        },
      });
    },
    targetCastConfig: {
      // adjust
      canActivate: ({ isEnemy, unitGroup }) => !isEnemy && unitGroup.type.name === 'Raiders',
    },
  },
});
