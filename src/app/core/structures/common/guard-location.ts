import { neutralsFraction } from '../../fractions/neutrals/fraction';
import { NeutralRewardTypesEnum, StructureGeneratorModel, StuctureControl } from '../types';


export const FireRingStructure: StructureGeneratorModel = {
  name: 'Fire Ring',
  actionPoints: 2,

  generateGuard() {
    return {
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [neutralsFraction.getUnitType('FireSpirits'), 7, 9, 3],
      ],
    };
  },
  control: StuctureControl.Neutral,
  generateReward: () => {
    return {
      type: NeutralRewardTypesEnum.NoReward,
    };
  }
};
