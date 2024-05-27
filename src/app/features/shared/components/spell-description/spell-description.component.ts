import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-spell-description',
  templateUrl: './spell-description.component.html',
  styleUrls: ['./spell-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellDescriptionComponent {
  public spell = input.required<Spell>();

  /* todo: this is possibly bad, maybe hero can be attached to spell itself. */
  public hero = input<Hero>();

  public player = input.required<Player>();

  public ownerUnit = input<UnitGroup>();

  public descriptions = computed(() => this.spell().baseType.getDescription({
    thisSpell: this.spell().baseType,
    spellInstance: this.spell(),
    ownerHero: this.hero() as Hero,
    ownerPlayer: this.player(),
    ownerUnit: this.ownerUnit(),
  }).descriptions);
}
