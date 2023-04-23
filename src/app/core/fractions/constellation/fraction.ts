import { Fractions, FractionsEnum } from '../fractions';

export type CONSTELLATION_UNIT_TYPES = 'Sprite' | 'Fencer' | 'Sagittar' | 'Chariot';

export const constellationFraction = Fractions.createFraction<CONSTELLATION_UNIT_TYPES>(
  FractionsEnum.Constellation,
  {
    title: 'Constellation',
    icon: 'aquarius',
  },
);