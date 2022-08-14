import { HiringReward, HiringRewardModel, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from "../../model/structures.types";
import { GenerationModel } from "../../utils/common.utils";

export function createHireStructure(name: string, guard: GenerationModel, unitsForHire: HiringRewardModel[]): StructureGeneratorModel {
    return {
        name: name,
        control: StuctureControl.Neutral,
    
        generateGuard: () => {    
            return guard;
        },
    
        generateReward: () => {
            const hiringReward: HiringReward = {
                type: NeutralRewardTypesEnum.UnitsHire,
                units: unitsForHire,
            };
    
            return hiringReward;
        },
    };
}