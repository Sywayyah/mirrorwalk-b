import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellActivationType, SpellInstance, SpellModel } from 'src/app/core/spells';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { MwPlayersService } from './';
import { PlayerCastsInstantSpell } from './events';
import { EventsService } from './store';


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
  sourceInfo: {},
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
    private readonly events: EventsService,
  ) { }

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

        this.events.dispatch(PlayerCastsInstantSpell({
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
