import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/model/main.model';
import { MwPlayersService } from '../../services';

@Component({
  selector: 'mw-player-info-panel',
  templateUrl: './mw-player-info-panel.component.html',
  styleUrls: ['./mw-player-info-panel.component.scss']
})
export class MwPlayerInfoPanelComponent implements OnInit {

  public player: PlayerInstanceModel = this.players.getCurrentPlayer();

  constructor(
    private players: MwPlayersService,
  ) { }

  ngOnInit(): void {
  }

}
