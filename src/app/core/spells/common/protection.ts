import { SpellActivationType } from '../types';
import { createSpell } from '../utils';


export const Protection = createSpell({
  name: 'Protection',
  icon: { icon: 'spear-head' },
  activationType: SpellActivationType.Passive,
  getDescription: () => ({
    descriptions: [
      `An aura that affects allies in range of 1 and gives damage block plus bonus armor.`
    ]
  }),
  config: {
    spellConfig: {
      init({ ownerUnit }) { },
    },
  },
});
