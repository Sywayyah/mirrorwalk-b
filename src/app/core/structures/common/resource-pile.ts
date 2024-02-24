import { formattedResources, getResourcesAsJoinedText, Resources } from '../../resources';
import { StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export function getResPileParams(resources: Resources): Resources {
  return resources;
}

export const ResourcesPileStructure = createStructure({
  id: '#struct-res-pile',
  name: 'Pile of Resources',
  control: StuctureControl.Neutral,
  description: ({ thisStruct }) => {
    const resources = thisStruct.structParams as Resources;
    const formattedRes = formattedResources(resources);

    return {
      name: formattedRes.length > 1 ? 'Pile of Resources' : `Pile of ${formattedRes[0].resName}`,
      descriptions: [
        `You found a pile of resources \n\n` + getResourcesAsJoinedText(resources),
      ],
    };
  },

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

