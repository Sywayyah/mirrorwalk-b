import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';

@Component({
  selector: 'mw-items-panel',
  templateUrl: './mw-items-panel.component.html',
  styleUrls: ['./mw-items-panel.component.scss']
})
export class MwItemsPanelComponent implements OnInit {

  public currentPlayer!: PlayerInstanceModel;

  constructor(
    private readonly players: MwPlayersService,
  ) { }

  ngOnInit(): void {
    this.currentPlayer = this.players.getCurrentPlayer();
  }

}