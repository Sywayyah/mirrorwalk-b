import { Fractions, FractionsEnum } from '../factions';

export type NEUTRAL_UNIT_TYPES =
  'Ghosts'
  | 'SupremeGhosts'
  | 'Skeletons'

  | 'Lich'
  | 'MasterLich'

  | 'Gnoll'
  | 'Thieves'
  | 'ForestTrolls'

  | 'FireSpirits'

  // bosses
  | 'Devastator'
  ;

const defaultReward = {
  gold: 0,
  experience: 0,
};

export const neutralsFraction = Fractions.createFraction<NEUTRAL_UNIT_TYPES>({
  id: '#faction-neutrals',
  fractionName: FractionsEnum.Neutrals,
  title: 'Neutrals',
  icon: 'monster-skull',
});
