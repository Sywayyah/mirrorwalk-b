import { Injectable } from '@angular/core';
import { HintsContainerComponent } from '../shared/components';

@Injectable({
  providedIn: 'root',
})
export class HintsService {
  public containerRef!: HintsContainerComponent;
}
