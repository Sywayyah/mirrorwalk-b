import { inject, Injectable } from '@angular/core';
import { TriggersRegistry } from 'src/app/core/triggers';
import { StoreClient } from 'src/app/store';
import { ApiProvider } from './api-provider.service';

@Injectable({
  providedIn: 'root'
})
export class MwTriggersService extends StoreClient() {
  private readonly apiProvider = inject(ApiProvider);

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
            this.apiProvider.getGameApi()
          );
        })
      });
    });
  }
}
