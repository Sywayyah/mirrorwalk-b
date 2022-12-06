import { Component, ElementRef, OnInit, TemplateRef } from '@angular/core';

export type HintAttachment = 'before' | 'after' | 'above' | 'below';

export interface ElementHint {
  template: TemplateRef<ElementRef>;
  targetElement: ElementRef;
  offsetLeft: number | null;
  offsetTop: number | null;
  offsetRight: number | null;
  offsetBottom: number | null;
  style: string;
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
    const { left, top, bottom } = elem.getBoundingClientRect();

    // default settings are for below
    let leftOffset = null;
    let topOffset: number | null = top + (elem.clientHeight / 2);
    let rightOffset = null;
    let style = 'transform: translateY(-50%)';
    let bottomOffset = null;

    switch (pos) {
      case 'after':
        leftOffset = left + elem.clientWidth;
        break;
      case 'before':
        rightOffset = window.innerWidth - left;
        break;
      case 'above':
        topOffset = null;
        style = 'transform: translateX(-50%)';
        bottomOffset = window.innerHeight - bottom + elem.clientHeight;
        leftOffset = left + elem.clientWidth / 2;
        break;
      case 'below':
        topOffset = bottom;
        style = 'transform: translateX(-50%)';
        leftOffset = left + elem.clientWidth / 2;
    }

    const hint: ElementHint = {
      targetElement: target,
      template,
      offsetLeft: leftOffset,
      offsetBottom: bottomOffset,
      offsetTop: topOffset,
      offsetRight: rightOffset,
      style: style,
    };

    this.hints.push(hint);

    return hint;
  }

  public removeHint(ref: ElementHint): void {
    const refIndex = this.hints.indexOf(ref);
    this.hints.splice(refIndex, 1);
  }
}
