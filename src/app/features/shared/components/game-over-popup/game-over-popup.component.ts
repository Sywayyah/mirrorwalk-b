import { Component } from '@angular/core';
import { BasicPopup } from '../popup-container';

@Component({
  selector: 'mw-game-over-popup',
  templateUrl: './game-over-popup.component.html',
  styleUrls: ['./game-over-popup.component.scss']
})
export class GameOverPopupComponent extends BasicPopup {

  constructor(
  ) {
    super();
  }

  goToMainScreen(): void {
    // for now, just reload the page.
    /*
      For now, I just cannot think of benefits of being able to reload game completely.
        The only one could be is that resources are loaded, and also if there
        will be saving/loading system, then state will have to be restored somehow.

      But for now, page reloading might be enough.
    */
    location.reload();
  }
}
