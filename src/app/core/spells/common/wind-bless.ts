import { Colors } from '../../assets';
import { spellPlainDescription } from '../../ui';
import { Modifiers, UnitGroupInstModel } from '../../unit-types';
import { SpellActivationType, SpellModel } from '../types';

type State = {
  roundsLeft: number,
  target: UnitGroupInstModel,
  mods: Modifiers,
};

const attackBonus = 2;

export const WindBlessBuff: SpellModel<State> = {
  name: 'Wind Bless',
  icon: {
    icon: 'feather-wing',
    bgClr: Colors.DefautlBuffBg,
    iconClr: Colors.DefautlBuffClr,
  },
  activationType: SpellActivationType.Buff,

  getDescription() {
    return spellPlainDescription(`Increases attack of ranged units by ${attackBonus}.`);
  },
  type: {
    spellInfo: {
      name: 'Wind Bless',
    },
    spellConfig: {
      init: ({ events, actions, spellInstance }) => {
        events.on({
          SpellPlacedOnUnitGroup(event) {
            const mods = actions.createModifiers({
              unitGroupBonusAttack: attackBonus,
            });

            spellInstance.state = {
              roundsLeft: 1,
              target: event.target,
              mods: mods,
            };


            actions.addModifiersToUnitGroup(event.target, mods);
          },
          NewRoundBegins(event) {
            const state = spellInstance.state as State;

            if (!(--state.roundsLeft)) {
              actions.removeSpellFromUnitGroup(state.target, spellInstance);
              actions.removeModifiresFromUnitGroup(state.target, state.mods);
            }
          }
        });

      },
      getManaCost: (spell) => 0,
    },
  }
};
