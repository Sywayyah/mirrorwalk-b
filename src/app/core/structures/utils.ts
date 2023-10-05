import { GenerationModel } from '../unit-types';
import { HiringReward, HiringRewardModel, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from './types';

export function createHireStructure(name: string, guard: GenerationModel, unitsForHire: HiringRewardModel[]): StructureGeneratorModel {
  return {
    name: name,
    actionPoints: 1,
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
