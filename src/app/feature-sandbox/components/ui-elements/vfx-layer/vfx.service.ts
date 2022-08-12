import { Injectable } from '@angular/core';
import type { Effect, EffectOptions, VfxLayerComponent } from './vfx-layer.component';


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

  public createXyVfx(
    x: number,
    y: number,
    effect: Effect,
    options: EffectOptions = { darkOverlay: true },
  ): void {
    this.layerComponent.createEffect(x, y, effect, options);
  }
}
