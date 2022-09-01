import { SpellActivationType, SpellModel } from "../../model/spells";


export const BlindnessSpell: SpellModel = {
    name: 'Blindness',
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
