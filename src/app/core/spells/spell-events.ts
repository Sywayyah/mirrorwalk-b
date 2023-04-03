import { createEventType } from 'src/app/store';
import { EventTypeByName, EventHandlersMap, EventNames, createEventsGroup } from 'src/app/store/events/event-groups';
import { PlayerInstanceModel } from '../players';
import { UnitGroupInstModel } from '../unit-types';
import { SpellInstance } from './types';


export const SpellEventsGroup = createEventsGroup({
  prefix: 'Spells',
  events: {
    PlayerTargetsSpell: createEventType<{ target: UnitGroupInstModel }>(''),
    SpellPlacedOnUnitGroup: createEventType<{ target: UnitGroupInstModel }>(''),
    NewRoundBegins: createEventType<{ round: number }>(''),
    PlayerCastsInstantSpell: createEventType<{ player: PlayerInstanceModel, spell: SpellInstance }>(''),
    UnitGroupAttacks: createEventType<{
      attacker: UnitGroupInstModel;
      attacked: UnitGroupInstModel;
    }>(''),
  },
});

export const SpellEvents = SpellEventsGroup.events;


export type SpellGroupType = typeof SpellEventsGroup;

export type SpellEventNames = EventNames<SpellGroupType>;
export type SpellEventTypeByName<K extends SpellEventNames> = EventTypeByName<SpellGroupType, K>;
export type SpellEventHandlers = EventHandlersMap<SpellGroupType>;
