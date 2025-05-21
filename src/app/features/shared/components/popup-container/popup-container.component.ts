import { Component } from '@angular/core';
import { PopupService } from './popup.service';
import { getLast } from 'src/app/core/utils';

@Component({
    selector: 'mw-popup-container',
    templateUrl: './popup-container.component.html',
    styleUrls: ['./popup-container.component.scss'],
    standalone: false
})
export class PopupContainerComponent {
  constructor(
    public readonly popupsService: PopupService,
  ) { }

  // close latest popup on backdrop click if it's closeable
  handleOverlayClick(event: MouseEvent): void {
    event.preventDefault();
    const popups = this.popupsService.popups;
    const lastPopup = getLast(popups);

    if (lastPopup.isCloseable) {
      this.popupsService.removePopup(lastPopup);
    }
  }
}
