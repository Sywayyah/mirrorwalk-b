import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HintsService } from 'src/app/feature-sandbox/services/ui/hints.service';
import { ElementHint } from '../hints-container/hints-container.component';

@Component({
  selector: 'mw-hover-hint',
  templateUrl: './hover-hint.component.html',
  styleUrls: ['./hover-hint.component.scss']
})
export class HoverHintComponent implements OnInit {

  @Input() public hintBody!: TemplateRef<ElementRef>;

  @ViewChild('elem', { static: true }) public elem!: ElementRef;
  @ViewChild('generalHint', { static: true }) public generalHint!: TemplateRef<ElementRef>;

  public showHintAnimation: boolean = false;
  public transition: number = 0.3;

  private showTimeoutId: number | null = null;
  private hideTimeoutId: number | null = null;

  private ref!: ElementHint;

  constructor(
    private readonly hintsService: HintsService,
  ) { }

  ngOnInit(): void {
  }

  public onMouseEnter(): void {
    this.ref = this.hintsService.containerRef.createHint(
      this.elem,
      this.generalHint,
      'after'
    );

    this.showTimeoutId = window.setTimeout(() => {
      this.clearShowTimeout();
      this.showHintAnimation = true;
    }, 100);
  }

  public onMouseLeave(): void {
    this.clearShowTimeout();
    this.showHintAnimation = false;
    const prevRef = this.ref;

    this.hideTimeoutId = window.setTimeout(() => {
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
