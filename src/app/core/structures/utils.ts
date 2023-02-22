import { GenerationModel } from '../unit-types';
import { HiringRewardModel, StructureGeneratorModel, StuctureControl, HiringReward, NeutralRewardTypesEnum } from './types';

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
