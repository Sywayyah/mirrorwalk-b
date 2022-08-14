import { StructureGeneratorModel } from "../../model/structures.types";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/unit-types.dictionary";
import { createHireStructure } from "./utils";

export const CalavryStalls: StructureGeneratorModel = createHireStructure(
    'Cavalry Stalls',
    {
        fraction: HUMANS_FRACTION_UNIT_TYPES,
        maxUnitGroups: 1,
        minUnitGroups: 1,
        units: [
            [HF_TYPES_ENUM.Cavalry, 4, 4, 1],
        ],
    },
    [
        { unitType: HUMANS_FRACTION_UNIT_TYPES.Cavalry, maxCount: 4 },
    ],
);
