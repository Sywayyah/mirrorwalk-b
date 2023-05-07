
import { createEventsGroup } from 'src/app/store';
import * as BattleEvents from './events';

export const BattleEventsGroup = createEventsGroup({
  events: BattleEvents,
  prefix: 'Battle'
});

export const Battle = BattleEventsGroup.events;
