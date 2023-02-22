import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';

@Component({
  selector: 'mw-player-resources',
  templateUrl: './mw-player-resources.component.html',
  styleUrls: ['./mw-player-resources.component.scss']
})
export class MwPlayerResourcesComponent implements OnInit {

  public currentPlayer: PlayerInstanceModel = this.playersService.getCurrentPlayer();

  constructor(
    private readonly playersService: MwPlayersService,
  ) { }

  ngOnInit(): void {
  }

}
