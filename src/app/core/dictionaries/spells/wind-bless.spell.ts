import { UnitGroupInstModel } from "../../model/main.model";
import { Modifiers } from "../../model/modifiers";
import { SpellActivationType, SpellEventTypes, SpellModel } from "../../model/spells";

type State = {
    roundsLeft: number,
    target: UnitGroupInstModel,
    mods: Modifiers,
};

export const WIND_BLESS_BUFF: SpellModel<State> = {
    name: 'Wind Bless',
    level: 1,
    icon: {
        icon: 'feather-wing',
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