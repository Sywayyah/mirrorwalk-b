import { spellDescrElem } from 'src/app/core/ui';
import { SpellActivationType } from '../../types';
import { canActivateOnEnemyFn, createSpell } from '../../utils';

export const UniversalPinSpell = createSpell({
  id: `#spell-universal-pin`,
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
      targetCastConfig: {
        canActivate: canActivateOnEnemyFn,
      },
      getTargetActionHint({ ownerUnit, target }) {
        let pinChance = 100;

        const targetMods = target.modGroup;
        if (targetMods.getModValue('isCavalry') || targetMods.getModValue('isBigCreature')) {
          pinChance = 70;
        }

        if (targetMods.getModValue('isBoss')) {
          pinChance = 15;
        }

        if (targetMods.getModValue('isGiant') || target.type.level >= 6) {
          pinChance = 0;
        }

        return `Chance to pin: ${pinChance}%`;
      },
      init({ actions, events, ownerUnit, vfx }) {
        events.on({
          PlayerTargetsSpell({ target }) {
            actions.unitGroupAttack(ownerUnit!, target);

            const pinInfo = actions.pinAttempt(ownerUnit!, target);
            if (pinInfo.pinFailed) {
              actions.historyLog(`Pin attempt has failed`);
              return;
            }
            actions.historyLog(`Pin succeeded`);

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
