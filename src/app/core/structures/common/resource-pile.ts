import { resourceNames, ResourceType } from '../../resources';
import { StructureGeneratorModel, StuctureControl } from '../types';



export const resPileStructure = (
  resType: ResourceType,
  amount: number,
): StructureGeneratorModel => {

  return {
    name: 'Pile of ' + resourceNames[resType],
    control: StuctureControl.Neutral,
    description: `You found a pile of resources \n\n +${amount} ${resourceNames[resType]}`,

    onVisited: ({ playersApi, visitingPlayer }) => {
      playersApi.addResourcesToPlayer(
        visitingPlayer,
        resType,
        amount,
      );
    },
  };
};
