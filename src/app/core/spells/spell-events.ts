import { EventHandlersMap, EventNames, EventTypeByName, createEventType, createEventsGroup } from 'src/app/store';
import { Player } from '../players';
import { UnitGroup } from '../unit-types';
import { Spell } from './types';


export const SpellEventsGroup = createEventsGroup({
  prefix: 'Spells',
  events: {
    PlayerTargetsSpell: createEventType<{ target: UnitGroup }>(''),
    SpellPlacedOnUnitGroup: createEventType<{ target: UnitGroup }>(''),
    NewRoundBegins: createEventType<{ round: number }>(''),
    PlayerCastsInstantSpell: createEventType<{ player: Player, spell: Spell }>(''),
    UnitGroupAttacks: createEventType<{
      attacker: UnitGroup;
      attacked: UnitGroup;
    }>(''),
  },
});

export const SpellEvents = SpellEventsGroup.events;


export type SpellGroupType = typeof SpellEventsGroup;

export type SpellEventNames = EventNames<SpellGroupType>;
export type SpellEventTypeByName<K extends SpellEventNames> = EventTypeByName<SpellGroupType, K>;
export type SpellEventHandlers = EventHandlersMap<SpellGroupType>;
