import { Injectable } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/model/main.model';
import { SpellActivationType, SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { BattleEventsService } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';
import { BattleEvent } from './types';


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
  name: '',
  icon: { icon: '' },
  type: {
    spellInfo: {
      name: '',
    },
    spellConfig: {
      getManaCost(spellInst) {
        return 0;
      },
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
  baseType: NULL_SPELL,
}

@Injectable({
  providedIn: 'root'
})
export class MwCurrentPlayerStateService {

  public readonly currentPlayer: PlayerInstanceModel = this.players.getCurrentPlayer();

  public currentSpell: SpellInstance = NULL_SPELL_INSTANCE;

  public playerCurrentState: PlayerState = PlayerState.Normal;

  public spellsAreOnCooldown: boolean = false;

  constructor(
    private readonly players: MwPlayersService,
    private readonly events: BattleEventsService,
  ) {
    events.onEvents({
      [BattleEvent.Fight_Next_Round_Starts]: () => {
        this.resetSpellsCooldown();
      },
      [BattleEvent.Fight_Starts]: () => {
        this.resetSpellsCooldown();
      }
    }).subscribe();
  }

  public resetSpellsCooldown(): void {
    this.spellsAreOnCooldown = false;
  }

  public setSpellsOnCooldown(): void {
    this.spellsAreOnCooldown = true;
  }

  public onSpellClick(spell: SpellInstance): void {
    this.currentSpell = spell;

    switch (spell.baseType.activationType) {
      case 'instant':
        this.onCurrentSpellCast();

        this.events.dispatchEvent({
          type: BattleEvent.Player_Casts_Instant_Spell,
          player: this.currentPlayer,
          spell: spell,
        });

        this.setSpellsOnCooldown();
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

  public isSpellBeingCasted(): boolean {
    return this.currentSpell !== NULL_SPELL_INSTANCE;
  }

  public resetCurrentSpell(): void {
    this.currentSpell = NULL_SPELL_INSTANCE;
  }

  public cancelCurrentSpell(): void {
    this.resetCurrentSpell();
    this.playerCurrentState = PlayerState.Normal;
  }

  public onCurrentSpellCast(): void {
    this.players.addManaToPlayer(this.currentPlayer, -this.currentSpell.currentManaCost);
  }
}
