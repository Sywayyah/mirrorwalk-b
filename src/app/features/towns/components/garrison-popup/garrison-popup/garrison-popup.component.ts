import { Component, inject } from '@angular/core';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-garrison-popup',
  templateUrl: './garrison-popup.component.html',
  styleUrl: './garrison-popup.component.scss'
})
export class GarrisonPopupComponent extends BasicPopup<{}> {
  private readonly players = inject(MwPlayersService);

  readonly currentPlayer = this.players.getCurrentPlayer();

  hire(): void {
    this.close();
  }
}
