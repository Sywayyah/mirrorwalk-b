import { Colors } from '../../assets';
import { Modifiers } from '../../modifiers';
import { spellPlainDescription } from '../../ui';
import { UnitGroup } from '../../unit-types';
import { SpellActivationType, SpellBaseType } from '../types';

type State = {
  roundsLeft: number,
  target: UnitGroup,
  mods: Modifiers,
};

const attackBonus = 2;

export const WindBlessBuff: SpellBaseType<State> = {
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
              heroBonusAttack: attackBonus,
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
