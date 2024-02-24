import { Factions, FactionsEnum } from '../factions';

export type FORT_UNIT_TYPES =
  | 'Raiders'
  | 'Clan'

  | 'GoblinArcher'
  | 'GoblinShooter'

  | 'WolfRiders'
  ;

export const fortFraction = Factions.createFaction<FORT_UNIT_TYPES>({
  id: '#faction-fort',
  factionName: FactionsEnum.Fort,
  title: 'Fort',
  icon: 'spikeball',
});
