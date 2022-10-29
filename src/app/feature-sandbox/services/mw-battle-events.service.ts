import { Injectable } from '@angular/core';
import { EventsServiceBase } from './state-old/events-service-base';
import { BattleEvent, EventByEnumMapping } from './types';

@Injectable({
  providedIn: 'root'
})
/** @deprecated */
export class BattleEventsService extends EventsServiceBase<BattleEvent, EventByEnumMapping> {
}
