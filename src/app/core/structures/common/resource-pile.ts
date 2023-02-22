import { resourceNames, Resources, ResourceType } from '../../resources';
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
      playersApi.giveResourceToPlayer(
        visitingPlayer,
        resType,
        amount,
      );
    },
  };
};


export const resourcesPileStructure = (resources: Resources): StructureGeneratorModel => {

  return {
    name: 'Pile of Resources',
    control: StuctureControl.Neutral,
    description: `You found a pile of resources \n\n` + Object
      .entries(resources)
      .map(([resType, amount]) => `+${amount} ${resourceNames[resType as ResourceType]}`)
      .join('\n'),

    onVisited: ({ playersApi, visitingPlayer }) => {
      playersApi.giveResourcesToPlayer(
        visitingPlayer,
        resources,
      );
    },
  };
};
