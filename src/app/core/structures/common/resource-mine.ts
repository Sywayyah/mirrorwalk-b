import { StructId } from '../../entities';
import { ResourceType, Resources, resourceNames } from "../../resources";
import { StructureGeneratorModel, StructureType, StuctureControl } from "../types";
import { createStructure } from '../utils';


export const dailyResourcesMineStructure = ({ id, resources }: { id: StructId, resources: Resources; }): StructureGeneratorModel => {
  return createStructure({
    id,
    name: 'Mine with Resources',
    control: StuctureControl.Neutral,
    // description can become similar to new approach with for descriptions
    description: () => ({
      descriptions: [
        `You found a mine with resources, each day it will bring you:\n\n` + Object
          .entries(resources)
          .map(([resType, amount]) => `+${amount} ${resourceNames[resType as ResourceType]}`)
          .join('\n')
      ]
    }),

    type: StructureType.Scripted,

    config: {
      init({ localEvents, players, thisStruct, eventFeed }) {
        // start to give resources only after player visited the mine.

        localEvents.on({
          StructVisited() {
            thisStruct.visited = true;
            players.giveResourcesToPlayer(players.getCurrentPlayer(), resources);

            localEvents.on({
              NewDayBegins() {
                players.giveResourcesToPlayer(players.getCurrentPlayer(), resources);
              }
            });
          },
        })
      },
    },
  });
};
