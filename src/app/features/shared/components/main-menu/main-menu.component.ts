import { Component, inject } from '@angular/core';
import { BasicPopup } from '../popup-container';
import { EventsService } from 'src/app/store';
import { OpenSettings } from 'src/app/core/events';

@Component({
  selector: 'mw-main-menu-popup',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuPopupComponent extends BasicPopup {
  private readonly events = inject(EventsService);

  openSettings() {
    this.events.dispatch(OpenSettings());
  }

  quitTheGame() {
    location.reload();
  }
}
