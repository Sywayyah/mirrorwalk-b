import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';

@Component({
  selector: 'mw-player-info-panel',
  templateUrl: './mw-player-info-panel.component.html',
  styleUrls: ['./mw-player-info-panel.component.scss']
})
export class MwPlayerInfoPanelComponent implements OnInit {

  public player: PlayerInstanceModel = this.players.getCurrentPlayer();

  constructor(
    private players: MwPlayersService,
    public state: State,
  ) { }

  public ngOnInit(): void {
  }

}
