import { Fractions, FractionsEnum } from '../fractions';

export type FORT_UNIT_TYPES =
  | 'Raiders'
  | 'Clan'

  | 'GoblinArcher'
  | 'GoblinShooter'

  | 'WolfRiders'
  ;

export const fortFraction = Fractions.createFraction<FORT_UNIT_TYPES>({
  id: '#faction-fort',
  fractionName: FractionsEnum.Fort,
  title: 'Fort',
  icon: 'spikeball',
});
