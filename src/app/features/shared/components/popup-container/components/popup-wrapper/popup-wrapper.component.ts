import { Component, Injector, Input, OnInit, Type } from '@angular/core';
import { POPUP_REF } from '../../injection-tokens';
import { PopupData, PopupService } from '../../popup.service';

@Component({
  selector: 'mw-popup-wrapper',
  templateUrl: './popup-wrapper.component.html',
  styleUrls: ['./popup-wrapper.component.scss']
})
export class PopupWrapperComponent implements OnInit {

  @Input()
  public popupData!: PopupData;

  @Input()
  public isInactive = false;

  public injector!: Injector;

  constructor(
    private popups: PopupService,
  ) { }

  public ngOnInit(): void {
    this.injector = Injector.create({
      providers: [
        /* provide close(), do I need abstract class? */
        { provide: POPUP_REF, useValue: { data: this.popupData.data, close: () => { this.popups.removePopup(this.popupData) } } },
      ]
    });
  }
}
