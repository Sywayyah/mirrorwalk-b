import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mw-value-bar',
  templateUrl: './value-bar.component.html',
  styleUrls: ['./value-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValueBarComponent implements OnChanges {

  @Input()
  public maxValue: number = 0;

  @Input()
  public currentValue: number = 0;

  @Input()
  public color: string = 'red';

  @Input()
  public barHeight: number = 3;
  
  @Input()
  public side: 'left' | 'right' = 'right';

  constructor(
    private host: ElementRef,
    private renderer: Renderer2,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.barHeight) {
      this.renderer.setStyle(this.host.nativeElement, 'height', `${this.barHeight}px`);
    }
  }

}
