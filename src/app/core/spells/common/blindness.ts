import { spellDescrElem } from '../../ui';
import { SpellBaseType, SpellActivationType } from '../types';
import { createSpell } from '../utils';

export const BlindnessSpell: SpellBaseType = createSpell({
  id: '#spell-blindness',
  name: 'Blindness',
  activationType: SpellActivationType.Instant,
  icon: {
    icon: 'sunbeams',
  },
  getDescription() {
    return {
      descriptions: [spellDescrElem(`Decreases damage of target enemy group by ${15}%.`)],
    };
  },
  config: {
    getManaCost(spellInst) {
      return 0;
    },

    init: () => {},
  },
});
