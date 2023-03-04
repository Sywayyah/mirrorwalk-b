import { Injectable } from '@angular/core';
import { TriggersRegistry } from 'src/app/core/triggers';
import { StoreClient } from 'src/app/store';

@Injectable({
  providedIn: 'root'
})
export class MwTriggersService extends StoreClient() {

  constructor() {
    super();
    this.initTriggersFromTriggersRegistry();
  }

  private initTriggersFromTriggersRegistry(): void {
    TriggersRegistry.registryMap.forEach((triggers, event) => {
      triggers.forEach((trigger) => {
        this.events.onEvent(event).subscribe((data) => {
          trigger.fn(
            data,
            {
              events: {
                dispatch: (event) => { this.events.dispatch(event); }
              }
            });
        })
      });
    });
  }
}
