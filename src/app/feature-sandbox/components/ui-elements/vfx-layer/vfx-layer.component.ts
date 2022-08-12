import { Component, ComponentFactoryResolver, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { forkJoin, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { Animation } from '../vfx-element/animations';
import { VfxElementComponent } from '../vfx-element/vfx-element.component';
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

interface EffectPosition {
  left: number | null;
  top: number | null;
  right: number | null;
  bottom: number | null;
}

interface EffectInstRef {
  id: number;
  vfx: Effect;

  offset: EffectPosition;
}

export interface EffectOptions {
  darkOverlay?: boolean;
}

@Component({
  selector: 'mw-vfx-layer',
  templateUrl: './vfx-layer.component.html',
  styleUrls: ['./vfx-layer.component.scss']
})
export class VfxLayerComponent implements OnInit {

  public activeEffects: Map<number, EffectInstRef> = new Map();
  public EffectTypes: typeof EffectType = EffectType;

  @ViewChild('effectsContainer', { static: true, read: ViewContainerRef })
  public effectsContainerRef!: ViewContainerRef;

  @ViewChild('vfxElement', { static: true })
  public vfxElementRef!: TemplateRef<VfxElementComponent>;

  public effectsWithOverlay: number = 0;

  constructor(
    private vfxService: VfxService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private renderer: Renderer2,
  ) { }

  public ngOnInit(): void {
    this.vfxService.registerLayerComponent(this);
  }

  public createEffect(x: number, y: number, effect: Effect, options: EffectOptions): void {
    const newEffectId = this.vfxService.getNewId();

    const newEffect: EffectInstRef = {
      id: newEffectId,
      offset: {
        bottom: 0,
        left: x,
        right: 0,
        top: y,
      },
      vfx: effect,
    };

    if (options.darkOverlay) {
      this.effectsWithOverlay++;
    }

    this.activeEffects.set(newEffectId, newEffect);

    switch (effect.type) {
      case EffectType.VfxElement:
        const vfxEffect = effect as VfxElemEffect;

        const vfxComponentFactory = this.componentFactoryResolver.resolveComponentFactory(VfxElementComponent);
        const vfxComponentRef = this.effectsContainerRef.createComponent(vfxComponentFactory);

        const vfxComponentInstance = vfxComponentRef.instance;
        vfxComponentInstance.animation = vfxEffect.animation;

        const animationRef = vfxComponentInstance.playAnimation();

        forkJoin(
          animationRef.animationsList.map(animation => fromEvent(animation, 'finish').pipe(take(1)))
        ).subscribe(() => {
          this.activeEffects.delete(newEffectId);

          if (options.darkOverlay) {
            this.effectsWithOverlay--;
          }

          vfxComponentRef.destroy();
        });

        this.setElementPositionByOptions(vfxComponentInstance.hostElem.nativeElement, newEffect.offset);
    }
  }


  private setElementPositionByOptions(element: HTMLElement, options: EffectPosition): void {
    this.renderer.setStyle(element, 'position', 'fixed');
    this.renderer.setStyle(element, 'left', `${options.left}px`);
    this.renderer.setStyle(element, 'top', `${options.top}px`);
  }

}
