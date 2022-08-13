import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { EffectAnimation } from 'src/app/core/model/vfx-api/vfx-api.types';

export interface AnimationRef {
  elem: VfxElementComponent;
  animationsList: Animation[];
}

@Component({
  selector: 'mw-vfx-element',
  templateUrl: './vfx-element.component.html',
  styleUrls: ['./vfx-element.component.scss']
})
export class VfxElementComponent implements OnInit {

  @Input() public animation!: EffectAnimation;

  @ViewChild('container', { read: ViewContainerRef, static: true }) public viewContainerRef!: ViewContainerRef;
  @ViewChild('iconSfx', { static: true }) public iconSfx!: TemplateRef<unknown>;

  private createdViews: Record<string, ViewRef> = {};

  constructor(
    public renderer: Renderer2,
    public hostElem: ElementRef,
  ) { }

  public ngOnInit(): void {
    this.playAnimation();
  }

  public playAnimation(options: {duration?: number} = {duration: 1000}): AnimationRef {
    if (this.animation.config.layout === 'default') {
      this.renderer.addClass(this.hostElem.nativeElement, 'default-layout');
    }

    const animationsList: Animation[] = [];

    this.animation.elements.forEach(animationElemConfig => {
      const iconSfxView = this.viewContainerRef.createEmbeddedView(
        this.iconSfx,
        { icon: animationElemConfig.icon },
      );

      this.createdViews[animationElemConfig.id] = iconSfxView;

      const firstNode = iconSfxView.rootNodes[0] as HTMLElement;
      Object.entries(this.animation.elemsDefaultStyles[animationElemConfig.id]).forEach(([prop, value]) => {
        console.log(prop, value);
        this.renderer.setStyle(firstNode, prop, value);
      });
      this.renderer.addClass(firstNode, 'dl-sfx');

      const keyFramesConfig = this.animation.elemsKeyframes[animationElemConfig.id];

      const animation = firstNode.animate(keyFramesConfig, {
        duration: options.duration,
        fill: 'forwards',
      });

      animationsList.push(animation);
    });

    console.log('SFX -> ', this.createdViews);

    return {
      elem: this,
      animationsList: animationsList,
    };
  }

}
