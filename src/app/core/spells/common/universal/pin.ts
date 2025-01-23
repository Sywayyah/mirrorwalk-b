import { spellDescrElem } from 'src/app/core/ui';
import { SpellActivationType } from '../../types';
import { createSpell } from '../../utils';

export const UniversalPinSpell = createSpell({
  id: `#spell-unversal-pin`,
  name: 'Pin',
  icon: {
    icon: 'crossed-swords',
    iconClr: `rgb(255 255 255)`,
    bgClr: `#ff7163`,
  },
  getDescription() {
    return {
      descriptions: [
        spellDescrElem(
          'Attack-ability. Attacks and pins an enemy group, forcing it to deal less damage to everyone aside this group.',
        ),
        spellDescrElem(
          `<br/>Pinning unit also takes more damage from other unpinned enemy groups. Attacking or pinning different target will release previously pinned target.`,
        ),
        spellDescrElem(`<hr/>Learn more in Glossary.`),
      ],
    };
  },
  activationType: SpellActivationType.Target,
  config: {
    spellConfig: {
      isOncePerBattle: false,
      hideLevel: true,
      init({ actions, events, ownerUnit, vfx }) {
        events.on({
          PlayerTargetsSpell({ target }) {
            actions.unitGroupAttack(ownerUnit!, target);

            actions.pinAttempt(ownerUnit!, target);
            actions.historyLog(`Target is pinned`);
            vfx.createFloatingMessageForUnitGroup(target, { html: 'pinned' });
          },
        });
      },
      getManaCost() {
        return 0;
      },
    },
  },
});
