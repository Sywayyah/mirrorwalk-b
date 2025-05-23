import { Component, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HintsService } from 'src/app/features/services/hints.service';
import { ElementHint, HintAttachment } from '../hints-container/hints-container.component';

@Component({
    selector: 'mw-hover-hint',
    templateUrl: './hover-hint.component.html',
    styleUrls: ['./hover-hint.component.scss'],
    standalone: false
})
export class HoverHintComponent implements OnDestroy {

  @Input() public hintBody!: TemplateRef<ElementRef>;
  /* todo: improve transition and overall logic of this component later */
  @Input() public transition: number = 0.15;
  @Input() public hintPos: HintAttachment = 'after';

  @ViewChild('elem', { static: true }) public elem!: ElementRef;
  @ViewChild('generalHint', { static: true }) public generalHint!: TemplateRef<ElementRef>;

  public showHintAnimation: boolean = false;

  private showTimeoutId: number | null = null;

  private currentHintRef: ElementHint | null = null;

  constructor(
    private readonly hintsService: HintsService,
  ) { }

  ngOnDestroy(): void {
    this.onMouseLeave();
  }

  public onMouseEnter(): void {
    this.currentHintRef = this.hintsService.containerRef.createHint(
      this.elem,
      this.generalHint,
      this.hintPos,
    );

    this.showTimeoutId = window.setTimeout(() => {
      this.clearShowTimeout();
      this.showHintAnimation = true;
    }, 0);
  }

  public onMouseLeave(): void {
    this.clearShowTimeout();
    this.showHintAnimation = false;
    const prevRef = this.currentHintRef as ElementHint;
    this.currentHintRef = null;

    window.setTimeout(() => {
      this.hintsService.containerRef.removeHint(prevRef);
    }, this.transition * 1000);
  }

  private clearShowTimeout(): void {
    if (this.showTimeoutId) {
      window.clearTimeout(this.showTimeoutId);
    }
    this.showTimeoutId = null;
  }

}
