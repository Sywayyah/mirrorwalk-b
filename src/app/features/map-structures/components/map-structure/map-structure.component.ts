import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MapStructure } from 'src/app/core/structures';

@Component({
  selector: 'mw-map-structure',
  templateUrl: './map-structure.component.html',
  styleUrls: ['./map-structure.component.scss'],
})
export class MapStructureComponent {
  @Input()
  struct!: MapStructure;

  @Input()
  isAvailable: boolean = false;

  @Input()
  isCurrentLoc: boolean = false;

  // could be optimized
  @Input()
  activeLocColor: string = '';

  @Output()
  structSelected = new EventEmitter<MapStructure>();
}
