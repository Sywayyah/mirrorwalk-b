import { SpellActivationType, SpellModel } from "../../model/spells";


export const BLINDNESS_SPELL: SpellModel = {
    name: 'Blindness',
    level: 1,
    icon: {
        icon: 'sunbeams',
    },
    activationType: SpellActivationType.Instant,
    type: {
        spellInfo: {
            name: 'blindness',
        },
        spellConfig: {
            getManaCost(spellInst) {
                return 0;
            },

            init: () => { },
        },
    }
};