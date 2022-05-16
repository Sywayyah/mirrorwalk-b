import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel, SpellModel } from 'src/app/core/model/main.model';
import { MwPlayersService } from '../../services';
import { MwCurrentPlayerStateService } from '../../services/mw-current-player-state.service';

@Component({
  selector: 'mw-battle-hero-abilities',
  templateUrl: './mw-battle-hero-abilities.component.html',
  styleUrls: ['./mw-battle-hero-abilities.component.scss']
})
export class MwBattleHeroAbilitiesComponent implements OnInit {

  public currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();

  constructor(
    private readonly players: MwPlayersService,
    public readonly curPlayerState: MwCurrentPlayerStateService,
  ) { }

  ngOnInit(): void {
  }

  public onAbilityClick(spell: SpellModel) {
    this.curPlayerState.onSpellClick(spell);
  }

}
