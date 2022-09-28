import { Injectable } from '@angular/core';
import { EventsServiceBase } from './state/events-service-base';
import { BattleEvent, EventByEnumMapping } from './types';

@Injectable({
  providedIn: 'root'
})
export class BattleEventsService extends EventsServiceBase<BattleEvent, EventByEnumMapping> {
}
