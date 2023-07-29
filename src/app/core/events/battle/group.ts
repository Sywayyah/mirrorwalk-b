
import { EventGroupUtilTypes, createEventsGroup } from 'src/app/store';
import * as BattleCommands from './commands';
import * as BattleEvents from './events';

export const BattleEventsGroup = createEventsGroup({
  prefix: 'Battle',
  events: BattleEvents,
});

export const BattleCommandsGroup = createEventsGroup({
  prefix: 'BattleCommands',
  events: BattleCommands,
});

export const Battle = { ...BattleEventsGroup.events, ...BattleCommandsGroup.events };

type BattleEventGroupUtilTypes = EventGroupUtilTypes<typeof BattleEventsGroup>;
type BattleCommandsGroupUtilTypes = EventGroupUtilTypes<typeof BattleCommandsGroup>;

export type BattleCommandEvents = BattleCommandsGroupUtilTypes['GroupEventTypes'];
export type BattleEventsTypes = BattleEventGroupUtilTypes['GroupEventTypes'];

