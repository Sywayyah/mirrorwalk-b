import { Injectable } from '@angular/core';
import { CustomizableAnimationData, Effect, EffectAnimation, EffectOptions, EffectType, VfxElemEffect } from 'src/app/core/api/vfx-api';
import { UnitGroup } from 'src/app/core/unit-types/types';
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
    unitGroup: UnitGroup,
    effect: Effect,
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createVfxForUnitGroup(unitGroup, effect, {
      ...defaultOptions,
      ...options,
    });
  }

  public createEffectAnimationForUnitGroup(
    unitGroup: UnitGroup,
    animation: EffectAnimation,
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createVfxForUnitGroup(
      unitGroup,
      { type: EffectType.VfxElement, animation } as VfxElemEffect,
      {
        ...defaultOptions,
        ...options,
      });
  }

  public createFloatingMessageForUnitGroup(
    unitGroup: UnitGroup,
    data: CustomizableAnimationData,
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createFloatingMessageForUnitGroup(unitGroup, {
      custom: data,
    }, options);
  }

}
