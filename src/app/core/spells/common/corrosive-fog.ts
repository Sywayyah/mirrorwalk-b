import { spellDescrElem, strPercent } from '../../ui';
import { createCrackedShieldAnimation } from '../../vfx/spells/cracked-shield';
import { SpellActivationType } from '../types';
import { canActivateOnEnemyFn, createSpell, debuffColors } from '../utils';

const damageReduction = 0.14;
const uiPercent = strPercent(damageReduction);

const defenceReduction = 5;

const roundsDuration = 2;

const CorrosiveFogAnimation = createCrackedShieldAnimation();

export const CorrosiveFogDebuff = createSpell<undefined | { debuffRoundsLeft: number }>({
  id: '#spell-corrosive-fog-debuff',

  name: 'Corrosion',
  activationType: SpellActivationType.Debuff,
  icon: {
    icon: 'cracked-shield',
    ...debuffColors,
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(
          `Defence is lowered by ${defenceReduction}, damage by ${uiPercent}. Rounds left: ${data.spellInstance.state?.debuffRoundsLeft}.`,
        ),
      ],
    };
  },
  config: {
    isOncePerBattle: false,
    init({ events, actions, thisSpell, spellInstance, vfx }) {
      events.on({
        SpellPlacedOnUnitGroup({ target }) {
          const debuffData = {
            debuffRoundsLeft: roundsDuration,
          };
          spellInstance.state = debuffData;

          const modifiers = actions.createModifiers({
            baseDamagePercentModifier: -damageReduction,
            heroBonusDefence: -defenceReduction,
          });

          vfx.createEffectForUnitGroup(target, CorrosiveFogAnimation);

          actions.addModifiersToUnitGroup(target, modifiers);

          actions.historyLog(`${target.type.name} gets negative effect "${thisSpell.name}"`);

          events.on({
            NewRoundBegins(event) {
              debuffData.debuffRoundsLeft--;

              if (!debuffData.debuffRoundsLeft) {
                actions.removeSpellFromUnitGroup(target, spellInstance);
                actions.removeModifiresFromUnitGroup(target, modifiers);
              }
            },
          });
        },
      });
    },
  },
});

export const CorrosiveFogSpell = createSpell({
  id: '#spell-corrosive-fog',
  name: 'Corrosive Fog',
  activationType: SpellActivationType.Target,
  icon: {
    icon: 'cracked-shield',
  },
  getDescription(data) {
    return {
      descriptions: [
        spellDescrElem(
          `Surrounds an enemy with corrosive fog, reducing defence by ${defenceReduction} and outgoing damage by ${uiPercent}. Lasts ${roundsDuration} rounds.`,
        ),
      ],
    };
  },
  config: {
    targetCastConfig: {
      canActivate: canActivateOnEnemyFn,
    },
    getManaCost(spellInst) {
      const manaCosts: Record<number, number> = {
        1: 2,
        2: 2,
        3: 3,
        4: 4,
      };

      return manaCosts[spellInst.currentLevel];
    },

    init({ events, actions, ownerPlayer, ownerHero, thisSpell }) {
      events.on({
        PlayerTargetsSpell(event) {
          actions.historyLog(`${ownerHero.name} casts "${thisSpell.name}" against ${event.target.type.name}`);

          const poisonDebuffInstance = actions.createSpellInstance(CorrosiveFogDebuff);

          actions.addSpellToUnitGroup(event.target, poisonDebuffInstance, ownerPlayer);
        },
      });
    },
  },
});
