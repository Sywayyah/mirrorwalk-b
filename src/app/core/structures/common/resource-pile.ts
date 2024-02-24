import { resourceNames, Resources, ResourceType } from '../../resources';
import { StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export function getResPileParams(resources: Resources): Resources {
  return resources;
}

export const ResourcesPileStructure = createStructure({
  id: '#struct-res-pile',
  name: 'Pile of Resources',
  control: StuctureControl.Neutral,
  description: ({ thisStruct }) => ({
    descriptions: [
      `You found a pile of resources \n\n` + Object
        .entries(thisStruct.structParams as Resources)
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
            thisStruct.structParams as Resources,
          );
        },
      });

    }
  },
});
