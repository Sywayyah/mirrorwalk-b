import { Factions } from '../factions';

export const humansFaction = Factions.createFaction({
  id: '#faction-castle',
  title: 'Castle',
  icon: 'castle-emblem',
});

/* just to test dynamically loaded scripts */
(window as any).mw = { humansFaction: humansFaction };
