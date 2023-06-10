import { Component, Input } from '@angular/core';
import { UnitGroup } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-unit-groups-list',
  templateUrl: './mw-unit-groups-list.component.html',
  styleUrls: ['./mw-unit-groups-list.component.scss']
})
export class MwUnitGroupsListComponent {
  @Input() public unitGroups!: UnitGroup[];

  constructor() { }
}
