import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'mw-gradient-img',
  template: `
    <img [src]="imgSrc()">

    <div class="gradient"
        [style.background]="bgGradient()">
    </div>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
    }

    img {
      width: inherit;
      height: inherit;
    }

    .gradient {
      width: inherit;
      height: inherit;

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
   }
  `,
})
export class GradientImgComponent {
  readonly imgSrc = input.required<string>();
  readonly gradientClr = input.required<string>();

  readonly bgGradient = computed(() => (`
    linear-gradient(
      90deg,
      ${this.gradientClr()} 0%,
      rgba(33, 33, 33, 0.272233893557423) 5%,
      rgba(255, 255, 255, 0) 50%,
      rgba(32, 32, 32, 0.1966036414565826) 95%,
      ${this.gradientClr()} 100%
    )`));
}
