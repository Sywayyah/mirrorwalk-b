import { Fractions, FractionsEnum } from '../fractions';

export type HUMANS_UNIT_TYPES =
  | 'Pikemen'
  | 'Halberdier'

  | 'Archer'
  | 'Crossbowmen'

  | 'Knight'

  | 'Cavalry'
  | 'HeavyCavalry'

  | 'MysticBird'
  | 'Firebird';

export const humansFraction = Fractions.createFraction<HUMANS_UNIT_TYPES>(
  FractionsEnum.Humans,
  {
    title: 'Castle',
    icon: 'castle-emblem',
  },
);

/* just to test dynamically loaded scripts */
(window as any).mw = { humansFraction };
