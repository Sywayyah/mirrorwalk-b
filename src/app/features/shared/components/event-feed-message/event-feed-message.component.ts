import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DescriptionElementType, EventFeedMessage } from 'src/app/core/ui';

@Component({
  selector: 'mw-event-feed-message',
  templateUrl: './event-feed-message.component.html',
  styleUrls: ['./event-feed-message.component.scss']
})
export class EventFeedMessageComponent implements OnInit {
  @Input()
  public message!: EventFeedMessage;

  @Output()
  public messageExpired = new EventEmitter<void>();

  public type = DescriptionElementType;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.renderer.addClass(this.elementRef.nativeElement, 'visible');
    }, 0);

    setTimeout(() => {
      this.renderer.addClass(this.elementRef.nativeElement, 'hidden');
    }, (this.message.delay || 4000) - 400);

    setTimeout(() => {
      this.messageExpired.emit();
    }, this.message.delay || 4000);
  }
}
