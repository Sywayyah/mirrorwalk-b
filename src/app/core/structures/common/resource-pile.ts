import { formattedResources, Resources } from '../../resources';
import { DescriptionElementType } from '../../ui';
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

    const isPlural = formattedRes.length > 1;
    const singleRes = formattedRes[0].resName;

    return {
      name: isPlural ? 'Pile of Resources' : `Pile of ${singleRes}`,
      descriptions: [
        {
          type: DescriptionElementType.FreeHtml,
          htmlContent: `You found a pile of ${isPlural ? 'resourecs' : singleRes}`,
        },
        {
          type: DescriptionElementType.Resources,
          resources: formattedRes.map((res) => ({ resType: res.type, count: res.count })),
        },
      ],
    };
  },

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          thisStruct.visited = true;
          players.giveResourcesToPlayer(visitingPlayer, thisStruct.structParams as Resources);
        },
      });
    },
  },
});
