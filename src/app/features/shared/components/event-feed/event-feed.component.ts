import { Component, inject } from '@angular/core';
import { EventFeedMessage } from 'src/app/core/ui';
import { CommonUtils, injectCdr, onDestroy } from 'src/app/core/utils';
import { UiEventFeedService } from 'src/app/features/services/ui-event-feed.service';

@Component({
  selector: 'mw-event-feed',
  templateUrl: './event-feed.component.html',
  styleUrls: ['./event-feed.component.scss'],
  standalone: false
})
export class EventFeedComponent {
  public readonly eventFeed = inject(UiEventFeedService);
  private readonly cdr = injectCdr();

  constructor() {
    this.eventFeed.updatableRefs.push(this);
    onDestroy(() => CommonUtils.removeItem(this.eventFeed.updatableRefs, this));
  }

  updateView() {
    this.cdr.markForCheck();
  }

  public removeMessage(eventMessage: EventFeedMessage): void {
    this.eventFeed.removeMessage(eventMessage);
  }
}
