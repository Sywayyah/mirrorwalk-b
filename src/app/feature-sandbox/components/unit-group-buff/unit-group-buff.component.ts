import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Icon } from 'src/app/core/model/icons.types';
import { SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { TypedChanges } from 'src/app/core/utils/types';

@Component({
  selector: 'mw-unit-group-buff',
  templateUrl: './unit-group-buff.component.html',
  styleUrls: ['./unit-group-buff.component.scss']
})
export class UnitGroupBuffComponent implements OnChanges {

  @Input()
  public buff!: SpellInstance;

  public baseType!: SpellModel;

  public icon!: Icon;

  constructor() { }

  public ngOnChanges(changes: TypedChanges<this>): void {
    if (changes.buff) {
      this.baseType = this.buff.baseType;
      this.icon = this.baseType.icon;
    }
  }
}
