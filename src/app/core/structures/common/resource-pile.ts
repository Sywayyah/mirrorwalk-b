import { StructId } from '../../entities';
import { resourceNames, Resources, ResourceType } from '../../resources';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';


// todo: need to parametrize locations
export const resPileStructure = (
{ id, resType, amount }: { id: StructId, resType: ResourceType; amount: number; },
): StructureGeneratorModel => {

  return createStructure({
    id,
    name: 'Pile of ' + resourceNames[resType],
    control: StuctureControl.Neutral,
    description: () => ({
      descriptions: [`You found a pile of resources \n\n +${amount} ${resourceNames[resType]}`]
    }),

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
  });
};


export const resourcesPileStructure = (resources: Resources): StructureGeneratorModel => {

  return createStructure({
    id: '#struct-res-pile',
    name: 'Pile of Resources',
    control: StuctureControl.Neutral,
    description: () => ({
      descriptions: [
        `You found a pile of resources \n\n` + Object
          .entries(resources)
          .map(([resType, amount]) => `+${amount} ${resourceNames[resType as ResourceType]}`)
          .join('\n')
      ],
    }),

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
  });
};
