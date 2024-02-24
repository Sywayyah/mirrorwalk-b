import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const MagicRiverStructure: StructureGeneratorModel = createStructure({
  id: '#struct-magic-river',

  control: StuctureControl.Neutral,
  actionPoints: 1,
  name: 'Magic River',
  description: () => ({
    descriptions: [
      'Walking near magic river, you feel your magical powers restored.\n\n+4 to mana and +2 to max mana',
    ]
  }),

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          players.addMaxManaToPlayer(visitingPlayer, 2);
          players.addManaToPlayer(visitingPlayer, 4);
          thisStruct.visited = true;
        }
      });
    }
  },
});
