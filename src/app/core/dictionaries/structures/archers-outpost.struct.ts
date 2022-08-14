import { StructureGeneratorModel } from "../../model/structures.types";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/unit-types.dictionary";
import { createHireStructure } from "./utils";

export const ArchersOutpostStructure: StructureGeneratorModel = createHireStructure(
    'Archers Outpost',
    {
        fraction: HUMANS_FRACTION_UNIT_TYPES,
        maxUnitGroups: 3,
        minUnitGroups: 3,
        units: [
            [HF_TYPES_ENUM.Archers, 8, 11, 3],
        ],
    },
    [
        { unitType: HUMANS_FRACTION_UNIT_TYPES.Archers, maxCount: 12 },
    ],
);
