import { Fractions, FractionsEnum } from '../fractions';

export type NEUTRAL_UNIT_TYPES =
  'Ghosts'
  | 'SupremeGhosts'
  | 'Gnoll'
  | 'Thiefs'
  | 'ForestTrolls'

  | 'FireSpirits'
  ;

const defaultReward = {
  gold: 0,
  experience: 0,
};

export const neutralsFraction = Fractions.createFraction<NEUTRAL_UNIT_TYPES>(FractionsEnum.Neutrals, {
  title: 'Neutrals',
  icon: 'monster-skull',
});
