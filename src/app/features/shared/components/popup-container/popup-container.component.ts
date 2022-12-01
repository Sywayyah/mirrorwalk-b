import { Component } from '@angular/core';
import { PopupService } from './popup.service';

@Component({
  selector: 'mw-popup-container',
  templateUrl: './popup-container.component.html',
  styleUrls: ['./popup-container.component.scss']
})
export class PopupContainerComponent {
  constructor(
    public readonly popupsService: PopupService,
  ) { }
}
