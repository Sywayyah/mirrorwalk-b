import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HintsService } from 'src/app/features/services/hints.service';
import { ElementHint, HintAttachment } from '../hints-container/hints-container.component';

@Component({
  selector: 'mw-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input()
  public menuBody!: TemplateRef<ElementRef>;

  @Input()
  public transition: number = 0.15;

  @Input()
  public pos: HintAttachment = 'after';

  @Input()
  public closeOnClick: boolean = true;

  @Input()
  public disabled: boolean = false;

  @ViewChild('elem', { static: true })
  public elem!: ElementRef;

  @ViewChild('generalHint', { static: true })
  public generalHint!: TemplateRef<ElementRef>;

  public showHintAnimation: boolean = false;

  public currentHintRef: ElementHint | null = null;

  constructor(
    public host: ElementRef,
    private hintsService: HintsService,
  ) { }

  ngOnInit(): void {
  }

  public onClick(): void {
    if (this.disabled) {
      return;
    }

    this.hintsService.closeAllActiveMenus();

    this.showHintAnimation = true;

    this.hintsService.activeMenusCount += 1;
    this.hintsService.activeMenus.add(this);
    this.currentHintRef = this.hintsService.containerRef.createHint(this.elem, this.generalHint, this.pos);
  }

  public clearHint(): void {
    this.currentHintRef = null;
  }
}
