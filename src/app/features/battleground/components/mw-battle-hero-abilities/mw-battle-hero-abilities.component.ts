import { Component } from '@angular/core';
import { Player, PlayerState } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { MwCurrentPlayerStateService, MwPlayersService } from 'src/app/features/services';

@Component({
  selector: 'mw-battle-hero-abilities',
  templateUrl: './mw-battle-hero-abilities.component.html',
  styleUrls: ['./mw-battle-hero-abilities.component.scss'],
  standalone: false,
})
export class MwBattleHeroAbilitiesComponent {
  public currentPlayer: Player = this.players.getCurrentPlayer();

  constructor(
    private readonly players: MwPlayersService,
    public readonly curPlayerState: MwCurrentPlayerStateService,
  ) {}

  public onAbilityClick(spell: Spell) {
    if (
      spell.currentManaCost > this.currentPlayer.hero.stats.currentMana ||
      this.curPlayerState.state.get().areSpellsOnCooldown ||
      spell.cooldown
    ) {
      return;
    }

    if (this.curPlayerState.state.get().playerCurrentState === PlayerState.WaitsForTurn) {
      return;
    }

    this.curPlayerState.onSpellClick(spell);
  }
}
