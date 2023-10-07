import { humansFraction } from '../../fractions';
import { CommonUtils } from '../../utils';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';

export const MountainNestStructure: StructureGeneratorModel = {
  control: StuctureControl.Neutral,
  actionPoints: 2,
  name: 'Mountain Nest',
  description: 'Walking through mountains, you find a very bright birdnest... \n\n1-2 Firebirds join your army.',

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          players.addUnitGroupToPlayer(visitingPlayer, humansFraction.getUnitType('Firebird'), CommonUtils.randIntInRange(1, 2));

          thisStruct.visited = true;
        }
      });
    }
  },
};
