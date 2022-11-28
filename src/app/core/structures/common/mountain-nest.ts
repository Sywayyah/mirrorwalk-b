import { CommonUtils } from '../../unit-types';
import { HUMANS_FRACTION_UNIT_TYPES, HF_TYPES_ENUM } from '../../unit-types/humans';
import { StructureGeneratorModel, StuctureControl } from '../types';

export const MountainNestStructure: StructureGeneratorModel = {
  control: StuctureControl.Neutral,
  name: 'Mountain Nest',
  description: 'Walking through mountains, you find a very bright birdnest... \n\n1-2 Firebirds join your army.',

  onVisited: ({ playersApi, visitingPlayer }) => {
    playersApi.addUnitGroupToPlayer(visitingPlayer, HUMANS_FRACTION_UNIT_TYPES[HF_TYPES_ENUM.Firebird], CommonUtils.randIntInRange(1, 2));
  },
};
