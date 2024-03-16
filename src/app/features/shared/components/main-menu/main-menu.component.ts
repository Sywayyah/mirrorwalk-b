import { Component, OnDestroy, inject } from '@angular/core';
import { BasicPopup } from '../popup-container';
import { EventsService } from 'src/app/store';
import { OpenSettings } from 'src/app/core/events';
import { State } from 'src/app/features/services/state.service';
import { onEscape } from 'src/app/features/services/utils/keys.util';

@Component({
  selector: 'mw-main-menu-popup',
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuPopupComponent extends BasicPopup implements OnDestroy {
  private readonly events = inject(EventsService);
  private readonly state = inject(State);

  constructor() {
    super();
    this.state.mainMenu.isOpen = true;
    onEscape(() => this.close());
  }

  ngOnDestroy(): void {
    this.state.mainMenu.isOpen = false;
  }

  openSettings() {
    this.events.dispatch(OpenSettings());
  }

  quitTheGame() {
    location.reload();
  }
}
