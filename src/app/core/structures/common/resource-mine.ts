import { Resources, getResourcesAsJoinedText } from "../../resources";
import { StructureType, StuctureControl } from "../types";
import { createStructure } from '../utils';

export const DailyResourcesMineStructure = createStructure({
  id: '#struct-daily-res-mine',
  name: 'Mine with Resources',
  control: StuctureControl.Neutral,
  // description can become similar to new approach with for descriptions
  description: ({ thisStruct }) => ({
    descriptions: [
      `You found a mine with resources, each day it will bring you:\n\n` + getResourcesAsJoinedText(thisStruct.structParams as Resources),
    ]
  }),

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct, eventFeed }) {
      // start to give resources only after player visited the mine.

      localEvents.on({
        StructVisited() {
          thisStruct.visited = true;
          players.giveResourcesToPlayer(players.getCurrentPlayer(), thisStruct.structParams as Resources);

          localEvents.on({
            NewDayBegins() {
              players.giveResourcesToPlayer(players.getCurrentPlayer(), thisStruct.structParams as Resources);
            }
          });
        },
      })
    },
  },
});
