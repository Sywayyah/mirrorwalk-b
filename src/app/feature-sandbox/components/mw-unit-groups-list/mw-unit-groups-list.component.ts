import { Component, Input, OnInit } from '@angular/core';
import { UnitGroupModel } from 'src/app/core/model';

@Component({
  selector: 'mw-unit-groups-list',
  templateUrl: './mw-unit-groups-list.component.html',
  styleUrls: ['./mw-unit-groups-list.component.scss']
})
export class MwUnitGroupsListComponent implements OnInit {

  @Input() public unitGroups!: UnitGroupModel[];

  constructor() { }

  ngOnInit(): void {
  }

}
