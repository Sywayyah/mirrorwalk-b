import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Icon } from 'src/app/core/model/icons.types';
import { SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { TypedChanges } from 'src/app/core/utils/types';

@Component({
  selector: 'mw-unit-group-spell',
  templateUrl: './unit-group-spell.component.html',
  styleUrls: ['./unit-group-spell.component.scss']
})
export class UnitGroupSpellComponent implements OnChanges {
  @Input()
  public spell!: SpellInstance;

  public baseType!: SpellModel;

  public icon!: Icon;

  constructor() { }

  public ngOnChanges(changes: TypedChanges<this>): void {
    if (changes.spell) {
      this.baseType = this.spell.baseType;
      this.icon = this.baseType.icon;
    }
  }

}
