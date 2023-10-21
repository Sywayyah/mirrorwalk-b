import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { combineLatest, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';
import { CustomAnimationData, EffectAnimation, EffectOptions } from 'src/app/core/api/vfx-api';
import { CommonUtils } from 'src/app/core/utils';
import { VfxElementComponent } from '../vfx-element/vfx-element.component';
import { VfxService } from '../vfx-layer';

interface Animation {
  anim: EffectAnimation;
  options?: EffectOptions;
  data?: CustomAnimationData;
}

@Component({
  selector: 'mw-vfx-container',
  templateUrl: './vfx-container.component.html',
  styleUrls: ['./vfx-container.component.scss']
})
export class VfxContainerComponent implements OnInit, OnDestroy {
  private readonly vfxService = inject(VfxService);

  @Input()
  containerId!: string;

  animations: Animation[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.vfxService.registerVfxContainer(this.containerId, this);
  }

  ngOnDestroy(): void {
    this.vfxService.unregisterVfxContainer(this.containerId);
  }

  playAnimation(animationComponent: VfxElementComponent, animation: Animation) {
    const animRef = animationComponent.playAnimation(animation.anim, animation.options, animation.data);

    combineLatest(
      animRef.animationsList.map(animation => fromEvent(animation, 'finish'))
    ).pipe(take(1)).subscribe(() => {
      CommonUtils.removeItem(this.animations, animation);
    });
  }

  addAnimation(animation: EffectAnimation, options?: EffectOptions, data?: CustomAnimationData): void {
    this.animations.push({ anim: animation, options, data });
  }

}
