import { spellDescrElem } from '../../ui';
import { SpellActivationType, SpellBaseType } from '../types';
import { canActivateOnAliveFn, createSpell } from '../utils';

export const AstralBanishmentSpell: SpellBaseType = createSpell({
  id: '#spell-astral-banishment',

  name: 'Astral Banishment',
  activationType: SpellActivationType.Target,
  icon: {
    icon: '',
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(
          `Banishes unit into astral plane, where it cannot attack or be attacked, but receives increased magical damage.`,
        ),
      ],
    };
  },
  config: {
    getManaCost() {
      return 0;
    },
    init() {},
    targetCastConfig: {
      canActivate: canActivateOnAliveFn,
    },
  },
});
