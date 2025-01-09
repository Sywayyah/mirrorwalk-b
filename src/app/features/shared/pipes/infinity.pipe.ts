import { Pipe, PipeTransform } from '@angular/core';
import { infNum } from 'src/app/core/utils/common';

@Pipe({
    name: 'infNum',
    pure: true,
    standalone: false
})
export class MwSafeHtmlPipe implements PipeTransform {
  transform(num: number): number | string {
    return infNum(num);
  }
}
