import { Injectable } from '@angular/core';
import { UnitGroupInstModel } from 'src/app/core/model';
import { MwUnitGroupCardComponent } from '../components';

@Injectable({
  providedIn: 'root'
})
export class MwCardsMappingService {

  private mapping: Map<UnitGroupInstModel, MwUnitGroupCardComponent> = new Map();

  constructor() { }

  public register(unitGroup: UnitGroupInstModel, cardRef: MwUnitGroupCardComponent): void {
    this.mapping.set(unitGroup, cardRef);
  }

  public unregister(unitGroup: UnitGroupInstModel): void {
    this.mapping.delete(unitGroup);
  }

  public get(unitGroup: UnitGroupInstModel): MwUnitGroupCardComponent {
    return this.mapping.get(unitGroup) as MwUnitGroupCardComponent;
  }
}
