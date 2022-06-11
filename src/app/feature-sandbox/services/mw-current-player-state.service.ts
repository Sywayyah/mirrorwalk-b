import { Injectable } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/model/main.model';
import { SpellActivationType, SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { BattleEventsService } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';
import { BattleEventTypeEnum } from './types';


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
    spellInfo: {
      name: '',
    },
    spellConfig: {
      init: () => { },
    }
  }
};

const NULL_SPELL_INSTANCE: SpellInstance = {
  currentLevel: 0,
  currentManaCost: 0,
  description: '',
  name: '',
  state: null,
  type: NULL_SPELL,
}

@Injectable({
  providedIn: 'root'
})
export class MwCurrentPlayerStateService {

  public readonly currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();

  public currentSpell: SpellInstance = NULL_SPELL_INSTANCE;

  public playerCurrentState: PlayerState = PlayerState.Normal;

  constructor(
    private readonly players: MwPlayersService,
    private readonly events: BattleEventsService,
  ) { }

  public onSpellClick(spell: SpellInstance): void {
    this.currentSpell = spell;

    switch (spell.type.activationType) {
      case 'instant':
        this.events.dispatchEvent({
          type: BattleEventTypeEnum.Player_Casts_Instant_Spell,
          player: this.currentPlayer,
          spell: spell,
        });
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
    this.currentSpell = NULL_SPELL_INSTANCE;
  }
}
