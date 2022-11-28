import { SpellModel, SpellActivationType } from '../types';

export const BlindnessSpell: SpellModel = {
  name: 'Blindness',
  icon: {
    icon: 'sunbeams',
  },
  activationType: SpellActivationType.Instant,
  type: {
    spellInfo: {
      name: 'blindness',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: () => { },
    },
  }
};
