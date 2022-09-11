import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

/* 
  For now, I'm not sure if I want to use it for showing amount of units.
    Maybe it just needs time, or it can become useful if there will be portraits.

  For now, it still can be useful for debugging in some cases.
*/
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
  public barStyle: 'normal' | 'static' = 'static';

  @Input()
  public showMax: boolean = false;

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
