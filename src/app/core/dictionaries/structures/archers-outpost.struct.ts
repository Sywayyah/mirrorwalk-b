import { StructureGeneratorModel } from "../../model/structures.types";
import { HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/unit-types.dictionary";
import { createHireStructure } from "./utils";

export const ArchersOutpostStructure: StructureGeneratorModel = createHireStructure(
    'Archers Outpost',
    {
        maxUnitGroups: 3,
        minUnitGroups: 3,
        units: [
            [HUMANS_FRACTION_UNIT_TYPES.Archers, 8, 11, 3],
        ],
    },
    [
        { unitType: HUMANS_FRACTION_UNIT_TYPES.Archers, maxCount: 12 },
    ],
);
