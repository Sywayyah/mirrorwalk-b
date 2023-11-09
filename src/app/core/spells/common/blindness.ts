import { spellDescrElem } from '../../ui';
import { SpellBaseType, SpellActivationType } from '../types';

export const BlindnessSpell: SpellBaseType = {
  name: 'Blindness',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'sunbeams',
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(`Decreases damage of target enemy group by ${15}%.`),
      ],
    }
  },
  type: {
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },

      init: () => { },
    },
  }
};
