import { Component, Input } from '@angular/core';
import { DisplayUnitGroupInfo } from 'src/app/core/events';
import { UnitGroup } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-unit-groups-list',
  templateUrl: './mw-unit-groups-list.component.html',
  styleUrls: ['./mw-unit-groups-list.component.scss']
})
export class MwUnitGroupsListComponent {
  @Input() public unitGroups!: UnitGroup[];

  constructor(
    private readonly events: EventsService,
  ) { }

  displayUnitGroupInfo(unitGroup: UnitGroup): void {
    this.events.dispatch(DisplayUnitGroupInfo({ unitGroup }));
  }
}
