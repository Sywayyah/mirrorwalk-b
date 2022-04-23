import { Injectable } from '@angular/core';
import { UnitGroupModel } from 'src/app/core/model/main.model';
import { MwUnitGroupCardComponent } from '../components';

@Injectable({
  providedIn: 'root'
})
export class MwCardsMappingService {

  private mapping: Map<UnitGroupModel, MwUnitGroupCardComponent> = new Map();

  constructor() { }

  public register(unitGroup: UnitGroupModel, cardRef: MwUnitGroupCardComponent): void {
    this.mapping.set(unitGroup, cardRef);
  }

  public unregister(unitGroup: UnitGroupModel): void {
    this.mapping.delete(unitGroup);
  }
  
  public get(unitGroup: UnitGroupModel): MwUnitGroupCardComponent {
    return this.mapping.get(unitGroup) as MwUnitGroupCardComponent;
  }
}
