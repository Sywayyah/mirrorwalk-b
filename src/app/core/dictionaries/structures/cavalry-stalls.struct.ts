import { HiringReward, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from "../../model/structures.types";
import { GenerationModel } from "../../utils/common.utils";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/unit-types.dictionary";


export const CalavryStalls: StructureGeneratorModel = {
    name: 'Cavalry Stalls',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            fraction: HUMANS_FRACTION_UNIT_TYPES,
            maxUnitGroups: 1,
            minUnitGroups: 1,
            units: [
                [HF_TYPES_ENUM.Cavalry, 13, 13, 1],
            ],
        } as GenerationModel;

        return guard;
    },

    generateReward: () => {
        const hiringReward: HiringReward = {
            type: NeutralRewardTypesEnum.UnitsHire,
            units: [
                { unitType: HUMANS_FRACTION_UNIT_TYPES.Cavalry, maxCount: 3 },
            ],
        };

        return hiringReward;
    },
};
