import { Component, OnInit } from '@angular/core';
import { LEVELS_BREAKPOINTS } from 'src/app/core/dictionaries/levels.const';
import { PlayerInstanceModel } from 'src/app/core/model';
import { MwPlayersService } from '../../services';

@Component({
  selector: 'mw-experience-bar',
  templateUrl: './mw-experience-bar.component.html',
  styleUrls: ['./mw-experience-bar.component.scss']
})
export class MwExperienceBarComponent implements OnInit {

  public currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();
  public xpToNextLevel: number;

  constructor(
    private readonly players: MwPlayersService
  ) {
    this.xpToNextLevel = LEVELS_BREAKPOINTS[this.currentPlayer.hero.level + 1];
  }

  ngOnInit(): void {
  }

}
