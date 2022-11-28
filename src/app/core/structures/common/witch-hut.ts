import { EnchantSpell } from '../../spells/common';
import { StructureGeneratorModel, StuctureControl } from '../types';

export const WitchHutStructure: StructureGeneratorModel = {
  control: StuctureControl.Neutral,
  name: 'Witch Hut',
  description: 'Walking trough the woods, you find an abandoned Witch Hut.\n\nLearn "Enchant" level 2',

  onVisited: ({ playersApi, spellsApi, visitingPlayer }) => {
    const enchantSpell = spellsApi.createSpellInstance(EnchantSpell, { initialLevel: 2 });
    playersApi.addSpellToPlayerHero(visitingPlayer, enchantSpell);
  },
};
