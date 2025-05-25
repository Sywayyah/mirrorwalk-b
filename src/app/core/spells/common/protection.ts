import { SpellActivationType } from '../types';
import { createSpell } from '../utils';

export const ProtectionAuraBuff = createSpell({
  id: '#spell-protection-aura',

  name: 'Protected',
  activationType: SpellActivationType.Buff,
  icon: { icon: 'spear-head' },
  getDescription: () => ({ descriptions: [`Unit is being protected`] }),
  config: {
    onAcquired({ ownerUnit, spellInstance }) {
      // ownerUnit?.addCombatMods({blco})
    },
    init({}) {},
  },
});

export const ProtectionAura = createSpell({
  id: '#spell-protection',

  name: 'Protection',
  icon: { icon: 'spear-head' },
  activationType: SpellActivationType.Passive,
  getDescription: () => ({
    descriptions: [`An aura that affects allies in range of 1 and gives damage block plus bonus armor.`],
  }),
  config: {
    flags: {
      // aura might be established in another lifecycle, other than other spells
      // or maybe actually not.
      isAura: true,
    },
    onAcquired({ spellInstance, ownerUnit }) {
      // ownerUnit?.ownerHero.addAuraMod({
      //   __auraModifiers: () => ({ heroBonusAttack: 2 }),
      // } as Modifiers);
    },
    init({ ownerUnit, events, actions }) {
      // the question is: spells currently work only within battle it would seem.
      // what could it be like?
      events.on({
        AuraCheck({ target }) {},
      });
    },
  },
});
