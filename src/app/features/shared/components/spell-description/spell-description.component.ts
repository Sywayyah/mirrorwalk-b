import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Hero } from 'src/app/core/heroes';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellInstance } from 'src/app/core/spells';
import { DescriptionElement } from 'src/app/core/ui/descriptions';
import { UnitGroupInstModel } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-spell-description',
  templateUrl: './spell-description.component.html',
  styleUrls: ['./spell-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellDescriptionComponent implements OnInit {

  @Input()
  public spell!: SpellInstance;

  @Input()
  public hero!: Hero;

  @Input()
  public player!: PlayerInstanceModel;

  @Input()
  public ownerUnit?: UnitGroupInstModel;

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
