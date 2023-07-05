import { humansFraction } from '../../fractions';
import { CommonUtils } from '../../utils';
import { StructureGeneratorModel, StuctureControl } from '../types';

export const MountainNestStructure: StructureGeneratorModel = {
  control: StuctureControl.Neutral,
  name: 'Mountain Nest',
  description: 'Walking through mountains, you find a very bright birdnest... \n\n1-2 Firebirds join your army.',

  onVisited: ({ playersApi, visitingPlayer }) => {
    playersApi.addUnitGroupToPlayer(visitingPlayer, humansFraction.getUnitType('Firebird'), CommonUtils.randIntInRange(1, 2));
  },
};
