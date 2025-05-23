import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { PlayerState } from 'src/app/core/players';
import { Spell, SpellActivationType } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwCurrentPlayerStateService } from 'src/app/features/services';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-unit-group-spell',
  templateUrl: './unit-group-spell.component.html',
  styleUrls: ['./unit-group-spell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class UnitGroupSpellComponent {
  private readonly curPlayerState = inject(MwCurrentPlayerStateService);

  readonly spell = input.required<Spell>();
  readonly owner = input.required<UnitGroup>();
  readonly hero = input<Hero>();
  readonly currentUnit = input<UnitGroup>();

  readonly onCooldown = input<boolean>();
  readonly hintPos = input<HintAttachment>('above');

  readonly baseType = computed(() => this.spell().baseType);
  readonly icon = computed(() => this.baseType().icon);

  readonly isPassive = computed(() => this.baseType().activationType === SpellActivationType.Passive);

  readonly disabled = computed(() => this.currentUnit() !== this.owner() && !this.isPassive());

  public onSpellClick(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    /* Mana of unit and hero are getting combined */
    const combinedMana = (this.hero()?.getState().currentMana || 0) + (this.currentUnit()?.getMana() || 0);

    if (
      this.onCooldown() ||
      this.disabled() ||
      !this.owner().isAlive ||
      this.isPassive() ||
      combinedMana < this.spell().currentManaCost
    ) {
      return;
    }

    if (this.curPlayerState.state.get().playerCurrentState === PlayerState.WaitsForTurn) {
      return;
    }

    this.curPlayerState.onSpellClick(this.spell(), this.owner());
  }
}
