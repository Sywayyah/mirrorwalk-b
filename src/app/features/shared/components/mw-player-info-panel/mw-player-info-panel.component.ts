import { Component } from '@angular/core';
import { PlayerOpensHeroInfo } from 'src/app/core/events';
import { HERO_LEVELS_BREAKPOINTS } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-player-info-panel',
  templateUrl: './mw-player-info-panel.component.html',
  styleUrls: ['./mw-player-info-panel.component.scss']
})
export class MwPlayerInfoPanelComponent {

  public player: Player = this.players.getCurrentPlayer();

  constructor(
    private players: MwPlayersService,
    public state: State,
    private events: EventsService,
  ) { }

  public openPlayerInfo(): void {
    this.events.dispatch(PlayerOpensHeroInfo({}));
  }

  public getHeroActionHint(): string {
    const hero = this.player.hero;

    const nextLevel = hero.level + 1;

    return `
    <div>Level ${nextLevel} requires ${HERO_LEVELS_BREAKPOINTS[nextLevel] - hero.experience}xp (${hero.experience}/${HERO_LEVELS_BREAKPOINTS[nextLevel]})</div>
    `;
  }

}
