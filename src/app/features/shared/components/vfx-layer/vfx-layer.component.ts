import { ChangeDetectorRef, Component, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { combineLatest, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { CustomAnimationData, Effect, EffectInstRef, EffectOptions, EffectPosition, EffectType, VfxElemEffect } from 'src/app/core/api/vfx-api';
import { UnitGroup } from 'src/app/core/unit-types';
import { FloatingMessageAnimation } from 'src/app/core/vfx';
import { MwCardsMappingService } from 'src/app/features/services';
import { VfxElementComponent } from '../vfx-element/vfx-element.component';
import { VfxService } from './vfx.service';

/*
  VFX ideas:
    1. Maybe, instead of having shadow-overlay, there could be a shadow element
      below effect.
 */
@Component({
  selector: 'mw-vfx-layer',
  templateUrl: './vfx-layer.component.html',
  styleUrls: ['./vfx-layer.component.scss'],
  standalone: false
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
    private renderer: Renderer2,
    private unitsCardsMapping: MwCardsMappingService,
    public cdr: ChangeDetectorRef,
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
    unitGroup: UnitGroup,
    effect: Effect<EffectType>,
    options: EffectOptions
  ): void {
    const cardComponent = this.unitsCardsMapping.get(unitGroup);
    const cardElement = cardComponent.hostElem;

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

  /* in theory, createVfxForUnitGroup can be reused */
  public createFloatingMessageForUnitGroup(
    unitGroup: UnitGroup,
    data: CustomAnimationData,
    options: EffectOptions = {},
  ): void {
    const cardComponent = this.unitsCardsMapping.get(unitGroup);
    const cardElement = cardComponent.hostElem;

    const { left, top } = cardElement.getBoundingClientRect();

    const effect = { type: EffectType.VfxElement, animation: FloatingMessageAnimation } as VfxElemEffect;

    const newEffect = this.createNewEffect(
      {
        bottom: 0,
        left: left + (cardElement.clientWidth / 2),
        right: 0,
        top: top + (cardElement.clientHeight / 2),
      },
      effect,
    );


    this.instantiateEffect(
      effect,
      { darkOverlay: false, duration: 1000, ...options },
      newEffect,
      data,
    );
  }

  private createNewEffect(
    position: EffectPosition,
    effect: Effect,
  ): EffectInstRef {
    const newEffectId = this.vfxService.getNewId();

    const newEffect: EffectInstRef = {
      id: newEffectId,
      offset: position,
      vfx: effect,
    };

    return newEffect;
  }

  private instantiateEffect(
    effect: Effect<EffectType>,
    options: EffectOptions,
    newEffect: EffectInstRef,
    data: object = {},
  ): void {
    if (options.darkOverlay) {
      this.effectsWithOverlay++;
    }

    this.activeEffects.set(newEffect.id, newEffect);

    switch (effect.type) {
      case EffectType.VfxElement:
        const vfxEffect = effect as VfxElemEffect;

        const vfxComponentRef = this.effectsContainerRef.createComponent(VfxElementComponent);

        const vfxComponentInstance = vfxComponentRef.instance;

        const animationRef = vfxComponentInstance.playAnimation(
          vfxEffect.animation, {
          duration: options.duration,
        }, data);

        combineLatest(
          animationRef.animationsList.map(animation => fromEvent(animation, 'finish'))
        )
          .pipe(take(1))
          .subscribe(() => {
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
