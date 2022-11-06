import { Component } from '@angular/core';
import { PlayerInstanceModel, SpellInstance } from 'src/app/core/model';
import { MwCurrentPlayerStateService, MwPlayersService, PlayerState } from '../../services';

@Component({
  selector: 'mw-battle-hero-abilities',
  templateUrl: './mw-battle-hero-abilities.component.html',
  styleUrls: ['./mw-battle-hero-abilities.component.scss']
})
export class MwBattleHeroAbilitiesComponent {

  public currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();

  constructor(
    private readonly players: MwPlayersService,
    public readonly curPlayerState: MwCurrentPlayerStateService,
  ) { }

  public onAbilityClick(spell: SpellInstance) {
    if (spell.currentManaCost > this.currentPlayer.hero.stats.currentMana || this.curPlayerState.spellsAreOnCooldown) {
      return;
    }

    if (this.curPlayerState.playerCurrentState === PlayerState.WaitsForTurn) {
      return;
    }

    this.curPlayerState.onSpellClick(spell);
  }

}
