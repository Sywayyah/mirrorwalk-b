import { Component, HostBinding, Input } from '@angular/core';
import { UnitGroup } from 'src/app/core/unit-types';

@Component({
  selector: 'mw-unit-group-portrait',
  templateUrl: './unit-group-portrait.component.html',
  styleUrls: ['./unit-group-portrait.component.scss']
})
export class UnitGroupPortraitComponent {
  @Input()
  unitGroup!: UnitGroup;

  @Input()
  @HostBinding('class.to-right')
  toRight: boolean = true;
}
