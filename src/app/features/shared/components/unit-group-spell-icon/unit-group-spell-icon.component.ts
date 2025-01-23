import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-unit-group-spell-icon',
  templateUrl: './unit-group-spell-icon.component.html',
  styleUrls: ['./unit-group-spell-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class UnitGroupSpellIconComponent {
  readonly owner = input.required<UnitGroup>();
  readonly spell = input.required<Spell>();
  readonly hero = input<Hero>();
  readonly disabled = input(false);

  readonly combinedMana = computed(
    () =>
      this.owner().getStateSignal()().groupState.currentMana +
      (this.hero()?.getStateSignal()().currentMana || 0),
  );

  readonly hasEnoughMana = computed(() =>
    this.isPassive()
      ? true
      : this.combinedMana() >= this.spell().currentManaCost,
  );

  readonly onCooldown = input<boolean>();
  readonly hintPos = input<HintAttachment>('above');

  readonly notActivable = computed(
    () => this.onCooldown() || this.disabled() || !this.hasEnoughMana(),
  );
  readonly baseType = computed(() => this.spell().baseType);
  readonly icon = computed(() => this.spell().baseType.icon);
  readonly isPassive = computed(() => this.spell().isPassive());
  readonly spellConfig = computed(
    () => this.spell().baseType.config.spellConfig,
  );
}
