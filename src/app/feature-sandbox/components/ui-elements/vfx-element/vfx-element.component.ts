import { Component, ElementRef, EmbeddedViewRef, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { AnimationElementType, AnimationIconElement, CustomAnimationData, EffectAnimation, EffectOptions } from 'src/app/core/model/vfx-api/vfx-api.types';

export interface AnimationRef {
  elem: VfxElementComponent;
  animationsList: Animation[];
}

@Component({
  selector: 'mw-vfx-element',
  templateUrl: './vfx-element.component.html',
  styleUrls: ['./vfx-element.component.scss']
})
export class VfxElementComponent {

  @ViewChild('container', { read: ViewContainerRef, static: true }) public viewContainerRef!: ViewContainerRef;

  @ViewChild('iconSfx', { static: true }) public iconSfx!: TemplateRef<unknown>;
  @ViewChild('damageVfx', { static: true }) public damageVfx!: TemplateRef<unknown>;

  private createdViews: Record<string, ViewRef> = {};

  constructor(
    public renderer: Renderer2,
    public hostElem: ElementRef,
  ) { }

  public playAnimation(
    animation: EffectAnimation,
    options: EffectOptions = { duration: 1000 },
    data: CustomAnimationData = {},
  ): AnimationRef {
    if (animation.config.layout === 'default') {
      this.renderer.addClass(this.hostElem.nativeElement, 'default-layout');
    }

    const animationsList: Animation[] = [];

    animation.elements.forEach(animationElemConfig => {

      let iconSfxView: EmbeddedViewRef<unknown> = null as unknown as EmbeddedViewRef<unknown>;

      switch (animationElemConfig.type) {
        case AnimationElementType.Icon:
          iconSfxView = this.viewContainerRef.createEmbeddedView(
            this.iconSfx,
            { icon: (animationElemConfig as AnimationIconElement).icon },
          );

          break;
        case AnimationElementType.Customizable:
          iconSfxView = this.viewContainerRef.createEmbeddedView(
            this.damageVfx,
            { data: data.custom },
          );
      }

      this.createdViews[animationElemConfig.id] = iconSfxView;

      const firstNode = iconSfxView.rootNodes[0] as HTMLElement;
      Object.entries(animation.elemsDefaultStyles[animationElemConfig.id]).forEach(([prop, value]) => {
        // console.log(prop, value);
        this.renderer.setStyle(firstNode, prop, value);
      });
      this.renderer.addClass(firstNode, 'dl-sfx');

      const keyFramesConfig = animation.elemsKeyframes[animationElemConfig.id];

      const animationRef = firstNode.animate(keyFramesConfig, {
        duration: options.duration ?? 1000,
        fill: options.type ?? 'forwards',
        iterations: options.iterations ?? 1,
      });

      animationsList.push(animationRef);
    });

    // console.log('SFX -> ', this.createdViews);

    return {
      elem: this,
      animationsList: animationsList,
    };
  }

  // Destroys all created VFX elements
  public clearAnimation(): void {
    this.viewContainerRef.clear();
  }
}
