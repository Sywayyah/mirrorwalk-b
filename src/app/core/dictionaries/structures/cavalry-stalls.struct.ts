import { StructureGeneratorModel } from "../../model/structures.types";
import { HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/humans.units";
import { createHireStructure } from "./utils";

export const CalavryStalls: StructureGeneratorModel = createHireStructure(
    'Cavalry Stalls',
    {
        maxUnitGroups: 1,
        minUnitGroups: 1,
        units: [
            [HUMANS_FRACTION_UNIT_TYPES.Cavalry, 4, 4, 1],
        ],
    },
    [
        { unitType: HUMANS_FRACTION_UNIT_TYPES.Cavalry, maxCount: 4 },
    ],
);
