import { StructId, registerEntity } from '../entities';
import { GenerationModel } from '../unit-types';
import { HiringReward, HiringRewardModel, NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from './types';

export function createStructure(base: StructureGeneratorModel): StructureGeneratorModel {
  registerEntity(base);
  return base;
}

export function createHireStructure({ id, name, guard, unitsForHire }: { id: StructId, name: string; guard: GenerationModel; unitsForHire: HiringRewardModel[]; }): StructureGeneratorModel {
  return {
    id,
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
