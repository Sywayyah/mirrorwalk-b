import { neutralsFraction } from '../../factions/neutrals/fraction';
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
});
