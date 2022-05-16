import { Injectable } from '@angular/core';
import { PlayerInstanceModel, SpellModel } from 'src/app/core/model/main.model';
import { MwPlayersService } from './mw-players.service';


export enum PlayerState {
  Normal = 'normal',
  SpellTargeting = 'spell-targeting',
}


@Injectable({
  providedIn: 'root'
})
export class MwCurrentPlayerStateService {

  public readonly currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();

  public currentSpell!: SpellModel;

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
}
