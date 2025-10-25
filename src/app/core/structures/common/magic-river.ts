import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const MagicRiverStructure: StructureGeneratorModel = createStructure({
  id: '#struct-magic-river',

  control: StuctureControl.Neutral,
  actionPoints: 1,
  name: 'Magic River',
  description: ({ visitingPlayer }) => {
    const restorationPoints = visitingPlayer?.hero.modGroup.getModValue('specialtyMagicRecovery') ?? 0;

    return {
      descriptions: [
        'Walking near magic river, you feel your magical powers restored.\n\n+4 to Mana and +2 to Max Mana.',
        `+1 Mana restored per each point of Restoration (${restorationPoints}).`,
      ],
    };
  },

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          players.addMaxManaToPlayer(visitingPlayer, 2);

          const restorationLevel = visitingPlayer.hero.modGroup.getModValue('specialtyMagicRecovery') ?? 0;

          players.addManaToPlayer(visitingPlayer, 4 + restorationLevel);
          thisStruct.visited = true;
        },
      });
    },
  },
});
