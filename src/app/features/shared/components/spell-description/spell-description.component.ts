import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { DescHtmlElement, DescriptionElementType } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-spell-description',
  templateUrl: './spell-description.component.html',
  styleUrls: ['./spell-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SpellDescriptionComponent {
  readonly spell = input.required<Spell>();

  /* todo: this is possibly bad, maybe hero can be attached to spell itself. */
  readonly hero = input<Hero>();

  readonly player = input.required<Player>();

  readonly ownerUnit = input<UnitGroup>();

  readonly descriptions = computed(() => {
    const spell = this.spell();

    const descriptions = spell.baseType.getDescription({
      thisSpell: spell.baseType,
      spellInstance: spell,
      ownerHero: this.hero() as Hero,
      ownerPlayer: this.player(),
      ownerUnit: this.ownerUnit(),
    }).descriptions;

    if (spell.baseType.config.spellConfig.isOncePerBattle) {
      descriptions.unshift({
        type: DescriptionElementType.FreeHtml,
        htmlContent: 'Can be casted only once per battle.<br/><hr/>',
      } as DescHtmlElement);
    }

    return descriptions;
  });
}
