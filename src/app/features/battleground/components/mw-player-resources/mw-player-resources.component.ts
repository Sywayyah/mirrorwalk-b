import { Component } from '@angular/core';
import { Player } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';

@Component({
  selector: 'mw-player-resources',
  templateUrl: './mw-player-resources.component.html',
  styleUrls: ['./mw-player-resources.component.scss']
})
export class MwPlayerResourcesComponent {

  public currentPlayer: Player = this.playersService.getCurrentPlayer();

  constructor(
    private readonly playersService: MwPlayersService,
  ) { }

}
