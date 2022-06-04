import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';

export type HintAttachment = 'before' | 'after';

export interface ElementHint {
  template: TemplateRef<ElementRef>;
  targetElement: ElementRef;
  offsetLeft: number | null;
  offsetTop: number;
  offsetRight: number | null;
}

@Component({
  selector: 'mw-hints-container',
  templateUrl: './hints-container.component.html',
  styleUrls: ['./hints-container.component.scss']
})
export class HintsContainerComponent implements OnInit {
  public hints: ElementHint[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  public createHint(target: ElementRef, template: TemplateRef<ElementRef>, pos: HintAttachment): ElementHint {
    const elem = target.nativeElement as HTMLElement;
    const { left, top } = elem.getBoundingClientRect();
    // console.log(left, top, right, window.innerWidth, elem.clientWidth);

    const hint: ElementHint = {
      targetElement: target,
      template,
      offsetLeft: pos === 'after' ? left + elem.clientWidth : null,
      /* temporary */
      offsetTop: top + (elem.clientHeight / 2),
      offsetRight: pos === 'before' ? window.innerWidth - left : null,
    };

    this.hints.push(hint);

    return hint;
  }

  public removeHint(ref: ElementHint): void {
    const refIndex = this.hints.indexOf(ref);
    this.hints.splice(refIndex, 1);
  }
}
