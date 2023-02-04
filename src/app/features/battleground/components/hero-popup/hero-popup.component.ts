import { Component, OnInit } from '@angular/core';
import { MwPlayersService } from 'src/app/features/services';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-hero-popup',
  templateUrl: './hero-popup.component.html',
  styleUrls: ['./hero-popup.component.scss']
})
export class HeroPopupComponent extends BasicPopup<{}> implements OnInit {

  private currentPlayer = this.playersService.getCurrentPlayer();

  constructor(
    private readonly playersService: MwPlayersService,
  ) {
    super();

  }

  ngOnInit(): void {
  }

}
