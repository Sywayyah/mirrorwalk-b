import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { DescriptionElement } from 'src/app/core/ui/descriptions';
import { UnitGroup } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-spell-description',
  templateUrl: './spell-description.component.html',
  styleUrls: ['./spell-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellDescriptionComponent implements OnInit {

  @Input()
  public spell!: Spell;

  /* todo: this is possibly bad, maybe hero can be attached to spell itself. */
  @Input()
  public hero!: Hero;

  @Input()
  public player!: Player;

  @Input()
  public ownerUnit?: UnitGroup;

  public descriptions!: DescriptionElement[];

  constructor() { }

  ngOnInit(): void {
    this.descriptions = this.spell.baseType.getDescription({
      thisSpell: this.spell.baseType,
      spellInstance: this.spell,
      ownerHero: this.hero,
      ownerPlayer: this.player,
      ownerUnit: this.ownerUnit,
    }).descriptions;
  }

}
