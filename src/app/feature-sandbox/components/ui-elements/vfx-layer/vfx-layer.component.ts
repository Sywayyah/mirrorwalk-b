import { Component, OnInit } from '@angular/core';
import { Animation } from '../vfx-element/animations';
import { VfxService } from './vfx.service';

export enum EffectType {
  VfxElement,
}

export interface Effect<T extends EffectType = EffectType> {
  type: T;
}

export interface VfxElemEffect extends Effect<EffectType.VfxElement> {
  animation: Animation;
}

interface EffectInstRef {
  id: number;
  vfx: Effect;

  offset: {
    left: number | null;
    top: number | null;
    right: number | null;
    bottom: number | null;
  };
}

@Component({
  selector: 'mw-vfx-layer',
  templateUrl: './vfx-layer.component.html',
  styleUrls: ['./vfx-layer.component.scss']
})
export class VfxLayerComponent implements OnInit {

  public effects: EffectInstRef[] = [];
  public EffectTypes: typeof EffectType = EffectType;

  constructor(
    private vfxService: VfxService,
  ) { }

  public ngOnInit(): void {
    this.vfxService.registerLayerComponent(this);
  }

  public createEffect(x: number, y: number, effect: Effect): void {
    const newEffect: EffectInstRef = {
      id: this.vfxService.getNewId(),
      offset: {
        bottom: 0,
        left: x,
        right: 0,
        top: y,
      },
      vfx: effect,
    };

    this.effects.push(newEffect);
  }

}
