import { Fractions, FractionsEnum } from '../fractions';

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

export const constellationFraction = Fractions.createFraction<CONSTELLATION_UNIT_TYPES>({
  id: '#faction-constellation',
  fractionName: FractionsEnum.Constellation,
  title: 'Constellation',
  icon: 'arrow-cluster',
},
);
