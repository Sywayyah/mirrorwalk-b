import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const DarkArtsSchool: StructureGeneratorModel = createStructure({
  id: '#struct-dark-arts-school',
  control: StuctureControl.Neutral,
  actionPoints: 2,
  name: 'School of Dark Arts',
  description: () => ({
    descriptions: [
      'You are visiting the school of dark arts.\n\n+1 to Necromancy specialty',
    ]
  }),

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          visitingPlayer.hero.addStatsMods({ specialtyNecromancy: 1 });
          thisStruct.visited = true;
        }
      });
    }
  },
});
