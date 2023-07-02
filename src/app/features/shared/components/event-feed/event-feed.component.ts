import { Component } from '@angular/core';
import { EventFeedMessage } from 'src/app/core/ui';
import { UiEventFeedService } from 'src/app/features/services/ui-event-feed.service';

@Component({
  selector: 'mw-event-feed',
  templateUrl: './event-feed.component.html',
  styleUrls: ['./event-feed.component.scss']
})
export class EventFeedComponent {
  constructor(public readonly eventFeed: UiEventFeedService) { }

  public removeMessage(eventMessage: EventFeedMessage): void {
    this.eventFeed.removeMessage(eventMessage);
  }

}
