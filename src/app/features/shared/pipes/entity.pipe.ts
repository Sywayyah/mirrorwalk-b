import { Pipe, PipeTransform } from '@angular/core';
import { UnitTypeId, resolveEntity } from 'src/app/core/entities';
import { UnitBaseType } from 'src/app/core/unit-types';

@Pipe({
    name: 'entity',
    pure: true,
    standalone: false
})
export class MwEntityPipe implements PipeTransform {
  transform(id: UnitTypeId): UnitBaseType {
    return resolveEntity(id);
  }
}
