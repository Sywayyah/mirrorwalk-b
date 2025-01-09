import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
    selector: 'mw-unit-group-spell-icon',
    templateUrl: './unit-group-spell-icon.component.html',
    styleUrls: ['./unit-group-spell-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class UnitGroupSpellIconComponent {
  owner = input.required<UnitGroup>();
  spell = input.required<Spell>();
  hero = input<Hero>();
  disabled = input(false);

  combinedMana = computed(() => (this.owner().getStateSignal()().groupState.currentMana) + (this.hero()?.getStateSignal()().currentMana || 0));

  hasEnoughMana = computed(() => this.isPassive() ? true : this.combinedMana() >= this.spell().currentManaCost);

  onCooldown = input<boolean>();
  hintPos = input<HintAttachment>('above');

  baseType = computed(() => this.spell().baseType);
  icon = computed(() => this.spell().baseType.icon);
  isPassive = computed(() => this.spell().isPassive());
}
