import { createEventType } from 'src/app/store';
import { createEventsGroup } from 'src/app/store/events/event-groups';
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

// generalize it
export type SpellEventTypes = keyof typeof SpellEvents;
export type SpellEvents = typeof SpellEvents[SpellEventTypes];

export type SpellEventType<K extends SpellEventTypes> = ReturnType<typeof SpellEvents[K]>;

export type SpellEventHandlers = { [K in keyof typeof SpellEvents]?: (target: ReturnType<typeof SpellEvents[K]>) => void };


// batch creation? grouped events? is it going to be useful? Gonna have to consider a couple of things
// at very least.

// gonna need to think how places in code are going to look
//  it feels like all events are going to be used with prefix of the group.
//  although, there can be a helper type straight from store folder, and it can actually
//  work to use strings/enums, because here we are going to store both strings/Events regardless

//  so, there will be 2 ways to work with groupedEvents, by group and string keys of this group
//   strings look the simplest, and gonna need to see if they are going to be refactorable,
//   although I'm not very sure about strings in terms of memory usage, since
//   there is no string pool in js

// There is at least one advantage: if I'm ever going to implement logging, by creating grouped events
//   I will be able to reuse their key in logs, this way descriptions won't be so crucial, and
//    can play a descriptive role even per case.

// anyways, I think I need to give it a shot. It is going to take some time to implement
//  and think through, and might be even discarded in the end (but looks interesting and promising)
