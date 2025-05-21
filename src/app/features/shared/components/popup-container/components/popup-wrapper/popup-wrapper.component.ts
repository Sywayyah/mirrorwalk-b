import { Component, ElementRef, HostListener, Injector, Input, OnInit, Renderer2, Type } from '@angular/core';
import { POPUP_REF } from '../../injection-tokens';
import { PopupData, PopupService } from '../../popup.service';

@Component({
    selector: 'mw-popup-wrapper',
    templateUrl: './popup-wrapper.component.html',
    styleUrls: ['./popup-wrapper.component.scss'],
    standalone: false
})
export class PopupWrapperComponent implements OnInit {

  @Input()
  public popupData!: PopupData;

  @Input()
  public isInactive = false;

  public injector!: Injector;

  constructor(
    private popups: PopupService,
    private hostElemRef: ElementRef,
    private renderer: Renderer2,
  ) { }

  public ngOnInit(): void {
    if (this.popupData.class) {
      this.renderer.addClass(
        this.hostElemRef.nativeElement,
        this.popupData.class
      );
    }

    this.injector = Injector.create({
      providers: [
        { provide: POPUP_REF, useValue: { data: this.popupData.data, close: () => { this.popups.removePopup(this.popupData) } } },
      ]
    });
  }

  @HostListener('click', ['$event'])
  preventClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
