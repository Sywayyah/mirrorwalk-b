import { Fractions, FractionsEnum } from '../fractions';

export type HUMANS_UNIT_TYPES = 'Archer'
  | 'Pikeman'
  | 'Knight'
  | 'Cavalry'
  | 'Firebird';

export const humansFraction = Fractions.createFraction<HUMANS_UNIT_TYPES>(FractionsEnum.Humans, {
  title: 'Castle',
  icon: 'castle-emblem',
});
