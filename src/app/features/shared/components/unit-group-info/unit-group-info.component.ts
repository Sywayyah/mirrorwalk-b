import { Component, Input, OnChanges } from '@angular/core';
import { DescriptionElement } from 'src/app/core/ui';
import { UnitGroup } from 'src/app/core/unit-types';
import { TypedChanges } from 'src/app/core/utils';

// this component can remain as it is
//  for now it will be displayed via popup
//  later might change
//  todo: provide RMB action hint for units
/* todo: create component for hero icon */
@Component({
  selector: 'mw-unit-group-info',
  templateUrl: './unit-group-info.component.html',
  styleUrls: ['./unit-group-info.component.scss']
})
export class UnitGroupInfoComponent implements OnChanges {
  @Input()
  public unitGroup!: UnitGroup;

  public description!: { descriptions: DescriptionElement[] };

  ngOnChanges(changes: TypedChanges<this>): void {
    this.description = this.unitGroup.type.getDescription?.({
      unit: this.unitGroup,
      unitBase: this.unitGroup.type,
    }) || { descriptions: [] };
  }
}
