import { Component } from '@angular/core';
import { HERO_LEVELS_BREAKPOINTS } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';

@Component({
    selector: 'mw-experience-bar',
    templateUrl: './mw-experience-bar.component.html',
    styleUrls: ['./mw-experience-bar.component.scss'],
    standalone: false
})
export class MwExperienceBarComponent {

  public currentPlayer: Player = this.players.getCurrentPlayer();
  public xpToNextLevel: number;

  constructor(
    private readonly players: MwPlayersService,
  ) {
    this.xpToNextLevel = HERO_LEVELS_BREAKPOINTS[this.currentPlayer.hero.level + 1];
  }
}
