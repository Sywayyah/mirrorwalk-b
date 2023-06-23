import { ResourceType, Resources, resourceNames } from "../../resources";
import { StructureGeneratorModel, StuctureControl } from "../types";


export const dailyResourcesMineStructure = (resources: Resources): StructureGeneratorModel => {

  return {
    name: 'Mine with Resources',
    control: StuctureControl.Neutral,
    // description can become similar to new approach with for descriptions
    description: `You found a mine with resources, each day it will bring you:\n\n` + Object
      .entries(resources)
      .map(([resType, amount]) => `+${amount} ${resourceNames[resType as ResourceType]}`)
      .join('\n'),

    // todo: adjust this, transfer other locations to event approach
    onVisited() { },

    config: {
      init({ localEvents, players, thisStruct }) {
        // start to give resources only after player visited the mine.

        localEvents.on({
          StructVisited() {
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
  };
};
