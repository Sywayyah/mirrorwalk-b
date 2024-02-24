import { Factions, FactionsEnum } from '../factions';

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

export const neutralsFaction = Factions.createFaction<NEUTRAL_UNIT_TYPES>({
  id: '#faction-neutrals',
  factionName: FactionsEnum.Neutrals,
  title: 'Neutrals',
  icon: 'monster-skull',
});
