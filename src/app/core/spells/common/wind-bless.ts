import { Colors } from '../../assets';
import { UnitGroupInstModel, Modifiers } from '../../unit-types';
import { SpellEventTypes } from '../spell-events';
import { SpellModel, SpellActivationType } from '../types';

type State = {
  roundsLeft: number,
  target: UnitGroupInstModel,
  mods: Modifiers,
};

export const WindBlessBuff: SpellModel<State> = {
  name: 'Wind Bless',
  icon: {
    icon: 'feather-wing',
    bgClr: Colors.DefautlBuffBg,
    iconClr: Colors.DefautlBuffClr,
  },
  activationType: SpellActivationType.Buff,
  description: 'Increases attack of ranged units by 2.',
  type: {
    spellInfo: {
      name: 'Wind Bless',
    },
    spellConfig: {
      init: ({ events, actions, spellInstance }) => {
        events.on({
          [SpellEventTypes.SpellPlacedOnUnitGroup]: (event) => {
            const mods = actions.createModifiers({
              unitGroupBonusAttack: 2,
            });

            spellInstance.state = {
              roundsLeft: 1,
              target: event.target,
              mods: mods,
            };


            actions.addModifiersToUnitGroup(event.target, mods);
          },
          [SpellEventTypes.NewRoundBegins]: (event) => {
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
