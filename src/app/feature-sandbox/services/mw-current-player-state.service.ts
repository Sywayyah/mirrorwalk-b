import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { SpellActivationType, SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { BattleEventsService } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';
import { EventsService } from './state';
import { PlayerCastsInstantSpell } from './state-values/battle-events';
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

  public currentCasterUnit: UnitGroupInstModel | undefined;

  public playerCurrentState: PlayerState = PlayerState.Normal;

  public playerStateChanged$: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.Normal);

  public spellsAreOnCooldown: boolean = false;

  constructor(
    private readonly players: MwPlayersService,
    private readonly battleEvents: BattleEventsService,
    private readonly newEvents: EventsService,
  ) { }

  // @Notify(BattleEvent.Fight_Next_Round_Starts)
  // @Notify(BattleEvent.Fight_Starts)
  public resetSpellsCooldowns(): void {
    this.spellsAreOnCooldown = false;
  }

  public setSpellsOnCooldown(): void {
    if (this.currentCasterUnit) {
      this.currentCasterUnit.fightInfo.spellsOnCooldown = true;

      this.currentCasterUnit = undefined;
    } else {
      /* set spells on cooldown if caster is not a unit */
      this.spellsAreOnCooldown = true;
    }
  }

  public onSpellClick(spell: SpellInstance, casterUnit?: UnitGroupInstModel): void {
    this.currentSpell = spell;
    this.currentCasterUnit = casterUnit;

    switch (spell.baseType.activationType) {
      case 'instant':
        this.onCurrentSpellCast();

        // this.battleEvents.dispatchEvent({
        //   type: BattleEvent.Player_Casts_Instant_Spell,
        //   player: this.currentPlayer,
        //   spell: spell,
        // });
        this.newEvents.dispatch(PlayerCastsInstantSpell({
          player: this.currentPlayer,
          spell: spell,
        }));

        this.setSpellsOnCooldown();
        break;
      case 'target':
        this.setPlayerState(PlayerState.SpellTargeting);
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
    this.setPlayerState(PlayerState.Normal);
    this.currentCasterUnit = undefined;
  }

  public onCurrentSpellCast(): void {
    this.players.addManaToPlayer(this.currentPlayer, -this.currentSpell.currentManaCost);
  }

  public setPlayerState(state: PlayerState): void {
    this.playerCurrentState = state;
    this.playerStateChanged$.next(state);
  }
}
