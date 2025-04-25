import { Injectable } from '@angular/core';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwUnitGroupCardComponent } from '../battleground/components';

@Injectable({
  providedIn: 'root',
})
export class MwCardsMappingService {
  private readonly mapping: Map<UnitGroup, MwUnitGroupCardComponent> = new Map();

  public register(unitGroup: UnitGroup, cardRef: MwUnitGroupCardComponent): void {
    this.mapping.set(unitGroup, cardRef);
  }

  public unregister(unitGroup: UnitGroup): void {
    this.mapping.delete(unitGroup);
  }

  public get(unitGroup: UnitGroup): MwUnitGroupCardComponent {
    return this.mapping.get(unitGroup) as MwUnitGroupCardComponent;
  }
}
