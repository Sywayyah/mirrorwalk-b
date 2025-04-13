import { ErrorHandler, inject } from "@angular/core";
import { UiEventFeedService } from "./features/services/ui-event-feed.service";

export class MwErrorHandler extends ErrorHandler {
  private readonly feed = inject(UiEventFeedService);

  handleError(error: any): void {
    console.error(error);

    if (error.message.startsWith('NG')) {
      return;
    }

    this.feed.pushSystemError(error);
  }
}
