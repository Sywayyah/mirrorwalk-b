import { Component, ComponentFactoryResolver, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { forkJoin, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { UnitGroupInstModel } from 'src/app/core/model/main.model';
import { MwCardsMappingService } from 'src/app/feature-sandbox/services/mw-cards-mapping.service';
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
    private unitsCardsMapping: MwCardsMappingService,
  ) { }

  public ngOnInit(): void {
    this.vfxService.registerLayerComponent(this);
  }

  public createXyVfx(x: number, y: number, effect: Effect, options: EffectOptions): void {
    const newEffect = this.createNewEffect(
      {
        bottom: 0,
        left: x,
        right: 0,
        top: y,
      },
      effect,
    );

    this.instantiateEffect(effect, options, newEffect);
  }

  public createVfxForUnitGroup(
    unitGroup: UnitGroupInstModel,
    effect: Effect<EffectType>,
    options: EffectOptions
  ): void {
    const cardComponent = this.unitsCardsMapping.get(unitGroup);
    const cardElement = cardComponent.hostElem.nativeElement as HTMLElement;

    const { left, top } = cardElement.getBoundingClientRect();

    const newEffect = this.createNewEffect(
      {
        bottom: 0,
        left: left + (cardElement.clientWidth / 2),
        right: 0,
        top: top + (cardElement.clientHeight / 2),
      },
      effect,
    );

    this.instantiateEffect(effect, options, newEffect);
  }

  private createNewEffect(position: EffectPosition, effect: Effect): EffectInstRef {
    const newEffectId = this.vfxService.getNewId();

    const newEffect: EffectInstRef = {
      id: newEffectId,
      offset: position,
      vfx: effect,
    };

    return newEffect;
  }

  private instantiateEffect(effect: Effect<EffectType>, options: EffectOptions, newEffect: EffectInstRef) {
    if (options.darkOverlay) {
      this.effectsWithOverlay++;
    }

    this.activeEffects.set(newEffect.id, newEffect);

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
          this.activeEffects.delete(newEffect.id);

          if (options.darkOverlay) {
            this.effectsWithOverlay--;
          }

          vfxComponentRef.destroy();
        });

        this.updateEffectElementPosition(vfxComponentInstance.hostElem.nativeElement, newEffect);
    }
  }

  private updateEffectElementPosition(element: HTMLElement, effect: EffectInstRef): void {
    this.renderer.setStyle(element, 'position', 'fixed');
    this.renderer.setStyle(element, 'left', `${effect.offset.left}px`);
    this.renderer.setStyle(element, 'top', `${effect.offset.top}px`);
  }

}
