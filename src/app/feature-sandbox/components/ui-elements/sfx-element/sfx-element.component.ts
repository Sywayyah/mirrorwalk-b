import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewRef } from '@angular/core';
import { Animation, FrightAnimation, LightningAnimation } from './animations';


@Component({
  selector: 'mw-sfx-element',
  templateUrl: './sfx-element.component.html',
  styleUrls: ['./sfx-element.component.scss']
})
export class SfxElementComponent implements OnInit {

  @Input() public animation: Animation = FrightAnimation;

  @ViewChild('container', { read: ViewContainerRef, static: true }) public viewContainerRef!: ViewContainerRef;
  @ViewChild('iconSfx', { static: true }) public iconSfx!: TemplateRef<unknown>;

  private createdViews: Record<string, ViewRef> = {};

  constructor(
    private renderer: Renderer2,
    private hostElem: ElementRef,
  ) { }

  ngOnInit(): void {
    if (this.animation.config.layout === 'default') {
      this.renderer.addClass(this.hostElem.nativeElement, 'default-layout');
    }

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

      firstNode.animate(keyFramesConfig, {
        duration: 1000,
        fill: 'forwards',
      });
    });

    console.log('SFX -> ', this.createdViews);
  }

}
