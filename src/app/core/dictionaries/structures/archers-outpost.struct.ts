import { HiringReward, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from "../../model/structures.types";
import { GenerationModel } from "../../utils/common.utils";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/unit-types.dictionary";


export const ArchersOutpostStructure: StructureGeneratorModel = {
    name: 'Archers Outpost',
    control: StuctureControl.Neutral,

    generateGuard: () => {
        const guard = {
            fraction: HUMANS_FRACTION_UNIT_TYPES,
            maxUnitGroups: 3,
            minUnitGroups: 3,
            units: [
                [HF_TYPES_ENUM.Archers, 8, 11, 3],
            ],
        } as GenerationModel;

        return guard;
    },

    generateReward: () => {
        const hiringReward: HiringReward = {
            type: NeutralRewardTypesEnum.UnitsHire,
            units: [
                { unitType: HUMANS_FRACTION_UNIT_TYPES.Archers, maxCount: 12 },
            ],
        };

        return hiringReward;
    },
};
