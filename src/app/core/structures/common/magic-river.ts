import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';
import { createStructure } from '../utils';

export const MagicRiverStructure: StructureGeneratorModel = createStructure({
  id: '#struct-magic-river',

  control: StuctureControl.Neutral,
  actionPoints: 1,
  name: 'Magic River',
  description: ({ visitingPlayer }) => {
    const restoration = visitingPlayer?.hero.modGroup.getModValue('specialtyMagicRecovery') ?? 0;

    return ({
      descriptions: [
        'Walking near magic river, you feel your magical powers restored.\n\n+4 to mana and +2 to max mana.',
        `+1 Mana per each point of Restoration (${restoration}).`,
      ]
    });
  },

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          players.addMaxManaToPlayer(visitingPlayer, 2);

          const restorationLevel = visitingPlayer.hero.modGroup.getModValue('specialtyMagicRecovery') ?? 0;
          console.log(restorationLevel);
          players.addManaToPlayer(visitingPlayer, 4 + restorationLevel);
          thisStruct.visited = true;
        }
      });
    }
  },
});
