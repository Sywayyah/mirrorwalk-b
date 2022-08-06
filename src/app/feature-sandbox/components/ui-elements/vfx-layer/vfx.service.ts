import { Injectable } from '@angular/core';
import type { Effect, VfxLayerComponent } from './vfx-layer.component';


@Injectable({
  providedIn: 'root'
})
export class VfxService {

  private latestVfxId: number = 0;

  private layerComponent!: VfxLayerComponent;

  constructor() { }

  public registerLayerComponent(component: VfxLayerComponent): void {
    this.layerComponent = component;
  }

  public getNewId(): number {
    return this.latestVfxId++;
  }

  public createXyVfx(x: number, y: number, effect: Effect): void {
    this.layerComponent.createEffect(x, y, effect);
  }
}
