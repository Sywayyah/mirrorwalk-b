import { Directive, ElementRef, HostListener, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomAnimationData, EffectAnimation, EffectOptions } from 'src/app/core/model/vfx-api/vfx-api.types';
import { CursorService } from '../components/ui-elements/custom-cursor/cursor.service';

export interface AnimatedCursor {

  animation: EffectAnimation,
  options?: EffectOptions,
  data?: CustomAnimationData,
}

@Directive({
  selector: '[mwCustomCursor]',
})
export class MwCustomCursorDirective implements OnDestroy {
  protected isHovered: boolean = false;

  protected cursorAnimation!: AnimatedCursor;

  protected destroyed$: Subject<void> = new Subject();

  constructor(
    protected cursor: CursorService,
    protected elemRef: ElementRef,
    protected renderer: Renderer2,
  ) {
    this.showCursorForHostElem(false);
  }

  @HostListener('mouseenter')
  public onMouseOver(): void {
    this.isHovered = true;
    const cursor = this.getCursorToShow();

    if (cursor) {
      this.showCursorForHostElem(false);
      this.cursor.setCustomCursor(cursor.animation, cursor.options, cursor.data);
    } else {
      this.showCursorForHostElem(true);
    }
  }

  @HostListener('mousemove', ['$event'])
  public onMouseMove(mouseEvent: MouseEvent): void {
    // todo: ngZone addEventListener + runOutsideAngular
    this.cursor.setCustomCursorPos(mouseEvent.clientX, mouseEvent.clientY);
  }

  @HostListener('mouseleave')
  public onMouseOut(): void {
    this.isHovered = false;
    this.cursor.clearCustomCursor();
  }

  public ngOnDestroy(): void {
    this.cursor.clearCustomCursor();
    this.isHovered = false;
    this.destroyed$.next();
  }

  protected getCursorToShow(): AnimatedCursor {
    return this.cursorAnimation;
  }

  protected setCursorIcon(cursor: AnimatedCursor): void {
    if (this.isHovered) {
      this.cursor.setCustomCursor(cursor.animation, cursor.options, cursor.data);
    }
  }

  protected recalcCursorIcon(): void {
    const cursor = this.getCursorToShow();
    if (this.isHovered) {
      this.setCursorIcon(cursor);
    }
  }

  private showCursorForHostElem(show: boolean): void {
    this.renderer.setStyle(this.elemRef.nativeElement, 'cursor', show ? 'auto' : 'none');
  }
}
