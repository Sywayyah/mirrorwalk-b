import { HiringReward, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from "../../model/structures.types";
import { GenerationModel } from "../../utils/common.utils";
import { NEUTRAL_FRACTION_UNIT_TYPES } from "../unit-types/neutral-unit-types.dictionary";



export const GraveyardStructure: StructureGeneratorModel = {
    name: 'Graveyard',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            maxUnitGroups: 3,
            minUnitGroups: 1,
            units: [
                [NEUTRAL_FRACTION_UNIT_TYPES.Ghosts, 14, 24, 3],
            ],
        } as GenerationModel;

        return guard;
    },

    generateReward: () => {
        const hiringReward: HiringReward = {
            type: NeutralRewardTypesEnum.UnitsHire,
            units: [
                { unitType: NEUTRAL_FRACTION_UNIT_TYPES.Ghosts, maxCount: 24 },
            ],
        };

        return hiringReward;
    },
};
