import { Fractions, FractionsEnum } from '../factions';

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

export const humansFraction = Fractions.createFraction<HUMANS_UNIT_TYPES>({
  id: '#faction-castle',
  fractionName: FractionsEnum.Humans,
  title: 'Castle',
  icon: 'castle-emblem',
});

/* just to test dynamically loaded scripts */
(window as any).mw = { humansFraction };
