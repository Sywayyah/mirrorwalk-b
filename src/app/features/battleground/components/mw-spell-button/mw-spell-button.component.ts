import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { Spell, SpellActivationType } from 'src/app/core/spells';
import { HintAttachment } from 'src/app/features/shared/components';

@Component({
    selector: 'mw-spell-button',
    templateUrl: './mw-spell-button.component.html',
    styleUrls: ['./mw-spell-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class MwSpellButtonComponent {
  spell = input.required<Spell>();
  player = input.required<Player>();
  hero = input.required<Hero>();

  disabled = input(false);

  isActive = input(false);

  hintPos = input<HintAttachment>('above');

  clicked = output<Spell>();

  isCurrentSpell = computed(() => this.isActive() && this.spell().baseType.activationType === this.activationTypes.Target);
  uiSpellIcon = computed(() => this.spell().baseType.icon);

  readonly activationTypes = SpellActivationType;
}
