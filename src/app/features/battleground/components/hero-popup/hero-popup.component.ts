import { Component } from '@angular/core';
import { InventoryItems } from 'src/app/core/items';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-hero-popup',
  templateUrl: './hero-popup.component.html',
  styleUrls: ['./hero-popup.component.scss']
})
export class HeroPopupComponent extends BasicPopup<{}> {

  private currentPlayer = this.playersService.getCurrentPlayer();

  public hero = this.currentPlayer.hero;

  public heroStats$ = this.hero.listenHeroStats();

  public itemSlots = InventoryItems.getSlotTypes();

  constructor(
    private readonly playersService: MwPlayersService,
    private readonly state: State,
  ) {
    super();
  }
}
