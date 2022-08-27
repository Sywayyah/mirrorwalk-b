import { Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { VfxService } from '../components/ui-elements/vfx-layer/vfx.service';


@Directive({
  selector: '[mwCustomCursor]',
})
export class MwCustomCursorDirective implements OnDestroy {
  protected isHovered: boolean = false;

  @Input()
  public icon: string = '';

  protected destroyed$: Subject<void> = new Subject();

  constructor(
    protected vfx: VfxService,
    protected elemRef: ElementRef,
    protected renderer: Renderer2,
  ) {
    this.showCursorForHostElem(false);
  }

  @HostListener('mouseover')
  public onMouseOver(): void {
    this.isHovered = true;
    const cursorIcon = this.getCursorIconToShow();

    if (cursorIcon) {
      this.showCursorForHostElem(false);
      this.vfx.setCustomCursor(cursorIcon);
    } else {
      this.showCursorForHostElem(true);
    }
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(mouseEvent: MouseEvent): void {
    // todo: ngZone addEventListener + runOutsideAngular
    this.vfx.setCustomCursorPos(mouseEvent.clientX, mouseEvent.clientY);
  }

  @HostListener('mouseout')
  public onMouseOut(): void {
    this.isHovered = false;
    this.vfx.clearCustomCursor();
  }

  public ngOnDestroy(): void {
    this.vfx.clearCustomCursor();
    this.isHovered = false;
    this.destroyed$.next();
  }

  protected getCursorIconToShow(): string {
    return this.icon;
  }

  protected setCursorIcon(icon: string): void {
    this.icon = icon;
    if (this.isHovered) {
      this.vfx.setCustomCursor(icon);
    }
  }

  protected recalcCursorIcon(): void {
    if (this.isHovered) {
      this.setCursorIcon(this.getCursorIconToShow());
    }
  }

  private showCursorForHostElem(show: boolean): void {
    this.renderer.setStyle(this.elemRef.nativeElement, 'cursor', show ? 'auto' : 'none');
  }
}
