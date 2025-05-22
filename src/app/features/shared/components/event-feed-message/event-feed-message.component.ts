import { Component, OnInit, input, output } from '@angular/core';
import { DescriptionElementType, EventFeedMessage } from 'src/app/core/ui';
import { injectHostElem, injectRenderer } from 'src/app/core/utils';

const defaultMsgDelay = 2000;
@Component({
  selector: 'mw-event-feed-message',
  templateUrl: './event-feed-message.component.html',
  styleUrls: ['./event-feed-message.component.scss'],
  standalone: false,
})
export class EventFeedMessageComponent implements OnInit {
  private readonly elementRef = injectHostElem();
  private readonly renderer = injectRenderer();

  public readonly message = input.required<EventFeedMessage>();

  public readonly messageExpired = output();

  public readonly DescriptionType = DescriptionElementType;

  ngOnInit(): void {
    setTimeout(() => {
      this.renderer.addClass(this.elementRef, 'visible');
    }, 0);

    const message = this.message();

    setTimeout(
      () => {
        this.renderer.addClass(this.elementRef, 'hidden');
      },
      (message.delay || defaultMsgDelay) - 400,
    );

    setTimeout(() => {
      this.messageExpired.emit();
    }, message.delay || defaultMsgDelay);
  }
}
