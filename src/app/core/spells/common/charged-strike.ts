import { spellDescrElem } from '../../ui';
import { SpellActivationType } from '../types';
import { createSpell } from '../utils';

// Storm Pike Item
export const ChargedStrikeSpell = createSpell({
  name: 'Charged Strike',
  activationType: SpellActivationType.Target,
  icon: { icon: 'lightning' },
  getDescription: () => ({
    descriptions: [
      spellDescrElem(`Makes current unit group attack enemy with additional lightning damage.`),
      spellDescrElem(`If current unit group is cavalry type, damage is doubled, as well as critical damage is added`),
      spellDescrElem(`Consumes Turn.`)
    ]
  }),

  config: {
    spellConfig: {
      init({ actions, events, vfx }) {

        events.on({
          PlayerTargetsSpell({ target }) {
            const currentUnitGroup = actions.getCurrentUnitGroup();

            actions.unitGroupAttack(currentUnitGroup, target);
          }
        });

      },
      getManaCost() { return 2; }
    }
  },
});
