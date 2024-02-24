import { Factions, FactionsEnum } from '../factions';

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

export const humansFaction = Factions.createFaction<HUMANS_UNIT_TYPES>({
  id: '#faction-castle',
  factionName: FactionsEnum.Humans,
  title: 'Castle',
  icon: 'castle-emblem',
});

/* just to test dynamically loaded scripts */
(window as any).mw = { humansFaction: humansFaction };
