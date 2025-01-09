import { Component } from '@angular/core';
import { Player } from 'src/app/core/players';
import { resourceNames } from 'src/app/core/resources';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';

@Component({
    selector: 'mw-player-resources',
    templateUrl: './mw-player-resources.component.html',
    styleUrls: ['./mw-player-resources.component.scss'],
    standalone: false
})
export class MwPlayerResourcesComponent {
  public readonly resourceNames = resourceNames;

  public readonly currentPlayer: Player = this.playersService.getCurrentPlayer();

  public readonly heroStats$ = this.currentPlayer.hero.listenHeroStats();

  constructor(
    private readonly playersService: MwPlayersService,
    public readonly state: State,
  ) { }

}
