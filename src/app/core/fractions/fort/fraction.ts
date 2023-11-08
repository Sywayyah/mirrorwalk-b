import { Fractions, FractionsEnum } from '../fractions';

export type FORT_UNIT_TYPES =
  | 'Raiders'
  | 'Clan'

  | 'GoblinArcher'
  | 'GoblinShooter'

  | 'WolfRiders'
  ;

export const fortFraction = Fractions.createFraction<FORT_UNIT_TYPES>(
  FractionsEnum.Fort,
  {
    title: 'Fort',
    icon: 'spikeball',
  },
);
