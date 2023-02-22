import { Injectable } from '@angular/core';
import { EffectOptions, Effect, CustomizableAnimationData } from 'src/app/core/api/vfx-api';
import { UnitGroupInstModel } from 'src/app/core/unit-types/types';
import type { VfxLayerComponent } from './vfx-layer.component';


const defaultOptions: EffectOptions = { darkOverlay: true, duration: 1000 };

@Injectable({
  providedIn: 'root'
})
export class VfxService {

  private latestVfxId: number = 0;

  private layerComponent!: VfxLayerComponent;

  constructor(
  ) { }

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
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createXyVfx(x, y, effect, {
      ...defaultOptions,
      ...options,
    });
  }

  public createVfxForUnitGroup(
    unitGroup: UnitGroupInstModel,
    effect: Effect,
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createVfxForUnitGroup(unitGroup, effect, {
      ...defaultOptions,
      ...options,
    });
  }

  public createFloatingMessageForUnitGroup(
    unitGroup: UnitGroupInstModel,
    data: CustomizableAnimationData,
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createFloatingMessageForUnitGroup(unitGroup, {
      custom: data,
    }, options);
  }

}
