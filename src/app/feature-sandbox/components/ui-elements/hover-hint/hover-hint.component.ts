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

  @ViewChild('elem', {static: true }) public elem!: ElementRef;
  @ViewChild('generalHint', {static: true }) public generalHint!: TemplateRef<ElementRef>;

  public displayHint: boolean = false;

  private ref!: ElementHint;

  constructor(
    private readonly hintsService: HintsService,
  ) { }

  ngOnInit(): void {
  }

  public onMouseEnter(): void {
    this.displayHint = true;
    this.ref = this.hintsService.containerRef.createHint(
      this.elem,
      this.generalHint,
      'after'
    );
  }

  public onMouseLeave(): void {
    this.displayHint = false;
    this.hintsService.containerRef.removeHint(this.ref);
  }
}
