import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerCastsInstantSpell, PlayersInitialized } from 'src/app/core/events';
import { Player, PlayerState } from 'src/app/core/players';
import { Spell, SpellActivationType, SpellBaseType } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { Notify, StoreClient } from 'src/app/store';
import { MwPlayersService } from './';
import { GameObjectsManager } from './game-objects-manager.service';

export const NULL_SPELL: SpellBaseType = {
  activationType: SpellActivationType.Instant,
  name: '',
  icon: { icon: '' },
  getDescription(data) {
    return {
      descriptions: [],
    }
  },
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

@Injectable({
  providedIn: 'root'
})
export class MwCurrentPlayerStateService extends StoreClient() {

  // think later about this, maybe avoid using null object
  private readonly NULL_SPELL_INSTANCE = this.gameObjectsManager.createNewGameObject(
    Spell,
    {
      initialLevel: 0,
      spellBaseType: NULL_SPELL,
      state: {},
    },
    'null-spell',
  );

  public currentPlayer!: Player;

  public currentSpell: Spell = this.NULL_SPELL_INSTANCE;

  public currentCasterUnit: UnitGroup | undefined;

  public playerCurrentState: PlayerState = PlayerState.Normal;

  public playerStateChanged$: BehaviorSubject<PlayerState> = new BehaviorSubject<PlayerState>(PlayerState.Normal);

  public spellsAreOnCooldown: boolean = false;

  constructor(
    private readonly players: MwPlayersService,
    private readonly gameObjectsManager: GameObjectsManager,
  ) {
    super();
  }

  @Notify(PlayersInitialized)
  public playersInit(): void {
    this.currentPlayer = this.players.getCurrentPlayer();
  }

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

  public onSpellClick(spell: Spell, casterUnit?: UnitGroup): void {
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
    return this.currentSpell !== this.NULL_SPELL_INSTANCE;
  }

  public resetCurrentSpell(): void {
    this.currentSpell = this.NULL_SPELL_INSTANCE;
  }

  public cancelCurrentSpell(): void {
    this.resetCurrentSpell();
    this.setPlayerState(PlayerState.Normal);
    this.currentCasterUnit = undefined;
  }

  public onCurrentSpellCast(): void {
    this.currentPlayer.hero.addMana(-this.currentSpell.currentManaCost)
  }

  public setPlayerState(state: PlayerState): void {
    this.playerCurrentState = state;
    this.playerStateChanged$.next(state);
  }
}
