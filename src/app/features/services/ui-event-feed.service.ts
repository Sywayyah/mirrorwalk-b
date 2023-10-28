import { Injectable } from '@angular/core';
import { DescriptionElementType, EventFeedMessage } from 'src/app/core/ui';
import { CommonUtils } from 'src/app/core/utils';

@Injectable({ providedIn: 'root' })
export class UiEventFeedService {
  public readonly visibleMessages: EventFeedMessage[] = [];

  private allMessages: EventFeedMessage[] = [];

  pushEventFeedMessage(message: EventFeedMessage): void {
    this.allMessages.push(message);
    this.visibleMessages.push(message);
  }

  pushPlainMessage(messageText: string): void {
    const message: EventFeedMessage = {
      message: [{ htmlContent: messageText, type: DescriptionElementType.FreeHtml }],
      delay: 2400,
    };

    this.pushEventFeedMessage(message);
  }

  removeMessage(eventMessage: EventFeedMessage): void {
    CommonUtils.removeItem(this.visibleMessages, eventMessage);
  }
}
