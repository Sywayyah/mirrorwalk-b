import { GenerationModel } from '../../unit-types';
import { NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const FireRingStructure: StructureGeneratorModel = createStructure({
  id: '#struct-fire-ring',

  name: 'Fire Ring',
  actionPoints: 2,

  generateGuard() {
    return {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        ['#unit-neut-fire-spirit-0', 6, 7, 3],
      ],
    };
  },
  control: StuctureControl.Neutral,
  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.NoReward,
    };
  }
});

export const GenericGuardStructure: StructureGeneratorModel = createStructure({
  id: '#struct-guard-lock',

  name: 'Fire Ring',
  actionPoints: 2,

  description: ({ thisStruct }) => {
    const { name } = thisStruct.getStructParams<{ name: string }>();
    return {
      name,
      descriptions: []
    };
  },

  generateGuard({ thisStruct }) {
    const { guards } = thisStruct.getStructParams<{ guards: GenerationModel }>();

    return guards;
  },

  control: StuctureControl.Neutral,

  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.NoReward,
    };
  }
});
