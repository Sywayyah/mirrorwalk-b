import { Injectable } from '@angular/core';
import {
  CustomizableAnimationData,
  Effect,
  EffectAnimation,
  EffectOptions,
  EffectType,
  VfxElemEffect,
} from 'src/app/core/api/vfx-api';
import { UnitGroup } from 'src/app/core/unit-types/types';
import { DroppingMessageAnimation } from 'src/app/core/vfx';
import { VfxContainerComponent } from '../vfx-container/vfx-container.component';
import type { VfxLayerComponent } from './vfx-layer.component';

const defaultOptions: EffectOptions = { darkOverlay: true, duration: 1000 };

@Injectable({
  providedIn: 'root',
})
export class VfxService {
  private latestVfxId: number = 0;

  private layerComponent!: VfxLayerComponent;

  private readonly containersMap = new Map<string, VfxContainerComponent>();

  public registerLayerComponent(component: VfxLayerComponent): void {
    this.layerComponent = component;
  }

  public registerVfxContainer(id: string, component: VfxContainerComponent): void {
    this.containersMap.set(id, component);
  }

  public unregisterVfxContainer(id: string): void {
    this.containersMap.delete(id);
  }

  public getNewId(): number {
    return this.latestVfxId++;
  }

  public createXyVfx(x: number, y: number, effect: Effect, options: EffectOptions = {}): void {
    this.layerComponent.createXyVfx(x, y, effect, {
      ...defaultOptions,
      ...options,
    });
  }

  public createVfxForUnitGroup(unitGroup: UnitGroup, effect: Effect, options: EffectOptions = {}): void {
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
    this.layerComponent.createVfxForUnitGroup(unitGroup, { type: EffectType.VfxElement, animation } as VfxElemEffect, {
      ...defaultOptions,
      ...options,
    });
  }

  public createEffectAnimationForContainer(id: string, animation: EffectAnimation, options: EffectOptions = {}): void {
    const container = this.containersMap.get(id);
    container?.addAnimation(animation);
  }

  public createFloatingMessageForUnitGroup(
    unitGroup: UnitGroup,
    data: CustomizableAnimationData,
    options: EffectOptions = {},
  ): void {
    this.layerComponent.createFloatingMessageForUnitGroup(
      unitGroup,
      {
        custom: data,
      },
      options,
    );
  }

  public createDroppingMessageForContainer(
    id: string,
    data: CustomizableAnimationData,
    options: EffectOptions = {},
  ): void {
    const container = this.containersMap.get(id);
    container?.addAnimation(DroppingMessageAnimation, { skipDlClass: true, ...options }, { custom: data });
  }
}
