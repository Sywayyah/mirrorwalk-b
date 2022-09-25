import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EventsServiceBase } from './state/events-service-base';
import { BattleEvent, EventByEnumMapping } from './types';


function isNullish<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined ? true : false;
}

function filterNullish<T>(source$: Observable<T | null | undefined>): Observable<T> {
  return source$.pipe(
    filter(isNullish),
  );
}

@Injectable({
  providedIn: 'root'
})
export class BattleEventsService extends EventsServiceBase<BattleEvent, EventByEnumMapping> {
}
