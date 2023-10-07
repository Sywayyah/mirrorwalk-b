import { resourceNames, Resources, ResourceType } from '../../resources';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';

export const resPileStructure = (
  resType: ResourceType,
  amount: number,
): StructureGeneratorModel => {

  return {
    name: 'Pile of ' + resourceNames[resType],
    control: StuctureControl.Neutral,
    description: `You found a pile of resources \n\n +${amount} ${resourceNames[resType]}`,

    type: StructureType.Scripted,

    config: {
      init({ localEvents, players, thisStruct }) {
        localEvents.on({
          StructVisited({ visitingPlayer }) {
            thisStruct.visited = true;
            players.giveResourceToPlayer(visitingPlayer, resType, amount);
          }
        });
      }
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

    type: StructureType.Scripted,

    config: {
      init({ localEvents, players, thisStruct }) {
        localEvents.on({
          StructVisited({ visitingPlayer }) {
            thisStruct.visited = true;
            players.giveResourcesToPlayer(
              visitingPlayer,
              resources,
            );
          },
        });

      }
    },
  };
};
