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
})
export class UnitGroupSpellComponent {
  private readonly curPlayerState = inject(MwCurrentPlayerStateService);

  spell = input.required<Spell>();
  owner = input.required<UnitGroup>();
  hero = input<Hero>();
  currentUnit = input<UnitGroup>();

  onCooldown = input<boolean>();
  hintPos = input<HintAttachment>('above');

  baseType = computed(() => this.spell().baseType);
  icon = computed(() => this.baseType().icon);

  isPassive = computed(() => this.baseType().activationType === SpellActivationType.Passive);

  disabled = computed(() => this.currentUnit() !== this.owner()
    && !this.isPassive());


  public onSpellClick(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    /* disable when player has no mana */

    if (this.onCooldown()
      || this.disabled()
      || !this.owner().fightInfo.isAlive
      || this.isPassive()) {
      return;
    }

    if (this.curPlayerState.playerCurrentState === PlayerState.WaitsForTurn) {
      return;
    }

    this.curPlayerState.onSpellClick(this.spell(), this.owner());
  }
}
