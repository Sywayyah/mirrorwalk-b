import { StructureGeneratorModel, StuctureControl } from "../../model/structures.types";
import { CommonUtils } from "../../utils/common.utils";
import { HF_TYPES_ENUM, HUMANS_FRACTION_UNIT_TYPES } from "../unit-types/humans.units";

export const MountainNestStructure: StructureGeneratorModel = {
    control: StuctureControl.Neutral,
    name: 'Mountain Nest',
    description: 'Walking through mountains, you find a very bright birdnest... \n\n1-2 Firebirds join your army.',

    onVisited: ({ playersApi, visitingPlayer }) => {
        playersApi.addUnitGroupToPlayer(visitingPlayer, HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Firebird], CommonUtils.randIntInRange(1, 2));
    },
};
