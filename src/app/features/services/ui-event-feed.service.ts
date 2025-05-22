import { Injectable, signal } from '@angular/core';
import { DescriptionElementType, EventFeedMessage } from 'src/app/core/ui';
import { CommonUtils } from 'src/app/core/utils';

@Injectable({ providedIn: 'root' })
export class UiEventFeedService {
  readonly visibleMessages = signal<EventFeedMessage[]>([]);

  readonly updatableRefs: { updateView(): void }[] = [];

  pushEventFeedMessage(message: EventFeedMessage): void {
    this.visibleMessages().push(message);
    this.updatableRefs.forEach((ref) => ref.updateView());
  }

  pushPlainMessage(messageText: string): void {
    const message: EventFeedMessage = {
      message: [{ htmlContent: messageText, type: DescriptionElementType.FreeHtml }],
      delay: 2600,
    };

    this.pushEventFeedMessage(message);
    this.updatableRefs.forEach((ref) => ref.updateView());
  }

  pushSystemError(error: Error): void {
    const message: EventFeedMessage = {
      message: [
        {
          htmlContent: `<div style="background: red; font-size: 15px; font-weight: 500">${error.message}</div>`,
          type: DescriptionElementType.FreeHtml,
        },
      ],
      delay: 5000,
    };

    this.pushEventFeedMessage(message);
  }

  removeMessage(eventMessage: EventFeedMessage): void {
    this.visibleMessages.update((messages) => CommonUtils.removeItemCopy(messages, eventMessage));
  }
}
