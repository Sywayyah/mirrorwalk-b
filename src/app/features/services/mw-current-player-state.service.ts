import { inject, Injectable } from '@angular/core';
import { PlayerCastsInstantSpell, PlayersInitialized } from 'src/app/core/events';
import { Player, PlayerState } from 'src/app/core/players';
import { createSpell, Spell, SpellActivationType, SpellBaseType } from 'src/app/core/spells';
import { ReactiveState } from 'src/app/core/state';
import { UnitGroup } from 'src/app/core/unit-types';
import { CommonUtils } from 'src/app/core/utils';
import { Notify, StoreClient } from 'src/app/store';
import { MwPlayersService } from './';
import { GameObjectsManager } from './game-objects-manager.service';

export const NULL_SPELL: SpellBaseType = createSpell({
  id: '#spell-null',
  activationType: SpellActivationType.Instant,
  name: '',
  icon: { icon: '' },
  getDescription(_data) {
    return {
      descriptions: [],
    };
  },
  config: {
    spellConfig: {
      getManaCost(_spellInst) {
        return 0;
      },
      init: () => {},
    },
  },
});

@Injectable({
  providedIn: 'root',
})
export class MwCurrentPlayerStateService extends StoreClient() {
  // adapt for right side control
  private readonly players = inject(MwPlayersService);
  private readonly gameObjectsManager = inject(GameObjectsManager);

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

  public readonly state = new ReactiveState({
    currentPlayer: null as Player | null,
    // todo: Maybe remove this Null pattern
    currentSpell: this.NULL_SPELL_INSTANCE,
    currentCasterUnit: undefined as UnitGroup | undefined,
    playerCurrentState: PlayerState.Normal,
    areSpellsOnCooldown: false,
  });

  @Notify(PlayersInitialized)
  public playersInit(): void {
    this.state.patch({ currentPlayer: this.players.getCurrentPlayer() });
  }

  public resetSpellsCooldowns(): void {
    this.state.patch({ areSpellsOnCooldown: false });
  }

  public setSpellsOnCooldown(): void {
    const currentCasterUnit = this.state.get().currentCasterUnit;
    if (currentCasterUnit) {
      currentCasterUnit.patchUnitGroupState({ spellsOnCooldown: true });

      this.state.patch({ currentCasterUnit: undefined });
    } else {
      this.state.patch({ areSpellsOnCooldown: true });
    }
  }

  public onSpellClick(spell: Spell, casterUnit?: UnitGroup): void {
    this.state.patch({
      currentSpell: spell,
      currentCasterUnit: casterUnit,
    });

    switch (spell.baseType.activationType) {
      case SpellActivationType.Instant:
        this.onCurrentSpellCast();

        this.events.dispatch(
          PlayerCastsInstantSpell({
            player: this.state.get().currentPlayer!,
            spell: spell,
          }),
        );

        this.setSpellsOnCooldown();
        break;
      case SpellActivationType.Target:
        this.setPlayerState(PlayerState.SpellTargeting);
        break;
      case SpellActivationType.Passive:
        break;
      default:
        break;
    }
  }

  public isSpellBeingCast(): boolean {
    return this.state.get().currentSpell !== this.NULL_SPELL_INSTANCE;
  }

  public resetCurrentSpell(): void {
    this.state.patch({ currentSpell: this.NULL_SPELL_INSTANCE });
  }

  public cancelCurrentSpell(): void {
    this.resetCurrentSpell();
    this.setPlayerState(PlayerState.Normal);
    this.state.patch({ currentCasterUnit: undefined });
  }

  public onCurrentSpellCast(): void {
    const currentSpell = this.state.get().currentSpell;
    const spellManacost = currentSpell.currentManaCost;

    if (currentSpell.baseType.config.spellConfig.isOncePerBattle) {
      currentSpell.setCooldown(Infinity);
    }

    const currentCasterUnit = this.state.get().currentCasterUnit;
    const currentPlayer = this.state.get().currentPlayer;
    if (!currentPlayer) {
      return;
    }
    if (currentCasterUnit) {
      const casterUnitMana = currentCasterUnit.getMana();
      const manaToBeRemoved = CommonUtils.limitedNumber(spellManacost, casterUnitMana);

      const unpaidManacost = spellManacost - manaToBeRemoved;

      if (manaToBeRemoved) {
        currentCasterUnit.addMana(-manaToBeRemoved);
      }

      if (unpaidManacost) {
        currentPlayer.hero.addMana(-unpaidManacost);
      }

      return;
    }

    currentPlayer.hero.addMana(-spellManacost);
  }

  public setPlayerState(state: PlayerState): void {
    this.state.patch({ playerCurrentState: state });
  }
}
