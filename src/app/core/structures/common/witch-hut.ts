import { EnchantSpell } from '../../spells/common';
import { StructureGeneratorModel, StructureType, StuctureControl } from '../types';

export const WitchHutStructure: StructureGeneratorModel = {
  control: StuctureControl.Neutral,
  actionPoints: 1,
  name: 'Witch Hut',
  description: () => ({
    descriptions: [
      'Walking trough the woods, you find an abandoned Witch Hut.\n\nLearn "Enchant" level 2',
    ]
  }),

  type: StructureType.Scripted,

  config: {
    init({ localEvents, players, thisStruct, spells }) {
      localEvents.on({
        StructVisited({ visitingPlayer }) {
          const enchantSpell = spells.createSpellInstance(EnchantSpell, { initialLevel: 2 });

          players.addSpellToPlayerHero(visitingPlayer, enchantSpell);
          thisStruct.visited = true;
        }
      });
    }
  },
};
