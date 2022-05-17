import { Injectable } from '@angular/core';
import { PlayerInstanceModel, SpellActivationType, SpellModel } from 'src/app/core/model/main.model';
import { MwPlayersService } from './mw-players.service';


export enum PlayerState {
  /* player makes his move */
  Normal = 'normal',
  /* targets a spell */
  SpellTargeting = 'spell-targeting',
  /* enemy now makes his turn */
  WaitsForTurn = 'waits-for-turn',
}

export const NULL_SPELL: SpellModel = {
  activationType: SpellActivationType.Instant,
  level: 0,
  name: '',
  type: {
    spellConfig: {
      name: '',
      init: () => { },
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class MwCurrentPlayerStateService {

  public readonly currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();

  public currentSpell: SpellModel = NULL_SPELL;

  public playerCurrentState: PlayerState = PlayerState.Normal;

  constructor(
    private readonly players: MwPlayersService,
  ) { }

  public onSpellClick(spell: SpellModel): void {
    this.currentSpell = spell;

    switch (spell.activationType) {
      case 'instant':
        break;
      case 'target':
        this.playerCurrentState = PlayerState.SpellTargeting;
        break;
      case 'passive':
        break;
      default:
        break;
    }
  }

  public resetCurrentSpell(): void {
    this.currentSpell = NULL_SPELL;
  }
}
