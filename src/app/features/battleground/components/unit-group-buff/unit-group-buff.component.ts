import { Component, Input, OnChanges } from '@angular/core';
import { Icon } from 'src/app/core/assets';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellInstance, SpellModel } from 'src/app/core/spells';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { TypedChanges } from 'src/app/core/utils';

@Component({
  selector: 'mw-unit-group-buff',
  templateUrl: './unit-group-buff.component.html',
  styleUrls: ['./unit-group-buff.component.scss']
})
export class UnitGroupBuffComponent implements OnChanges {

  @Input()
  public buff!: SpellInstance;

  @Input()
  public ownerUnit!: UnitGroupInstModel;

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
