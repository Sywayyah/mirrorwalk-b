import { SpellActivationType } from '../types';
import { createSpell } from '../utils';

export const DreamAura = createSpell({
  id: '#spell-dream-aura',
  name: 'Dream Aura',
  icon: { icon: 'overmind' },

  getDescription() {
    return { descriptions: ['Damage dealt to nearby allies becomes part of Star Dragon\'s dream. Increases All Resist (+17%) and Defence(6) for closest allies.'] };
  },
  activationType: SpellActivationType.Passive,
  config: {
    spellConfig: {
      init() { }
    },
  },
});
