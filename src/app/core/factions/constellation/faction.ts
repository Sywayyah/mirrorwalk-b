import { Factions, FactionsEnum } from '../factions';

export type CONSTELLATION_UNIT_TYPES = 'Sprite'
  | 'Fencer'

  | 'Sagittar'

  // Magic units
  | 'Astrologer'
  | 'Adviser'

  | 'Chariot'

  // Top tier units
  | 'NightWyvern'

  // star dragon might become a grand-summon
  | 'StarDragon'
  ;

export const constellationFaction = Factions.createFaction<CONSTELLATION_UNIT_TYPES>({
  id: '#faction-constellation',
  factionName: FactionsEnum.Constellation,
  title: 'Constellation',
  icon: 'arrow-cluster',
},
);
