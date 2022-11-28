import { Directive, ElementRef, HostListener, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { CustomAnimationData, EffectAnimation, EffectOptions } from 'src/app/core/api/vfx-api';
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

  private unlistenMouseMove!: () => void;

  constructor(
    protected cursor: CursorService,
    protected elemRef: ElementRef,
    protected renderer: Renderer2,
    protected ngZone: NgZone,
  ) {
    this.setNativeCursorVisibility(false);

    ngZone.runOutsideAngular(() => {
      this.unlistenMouseMove = renderer.listen(
        elemRef.nativeElement,
        'mousemove',
        (mouseEvent: MouseEvent) => {
          this.cursor.setCustomCursorPos(mouseEvent.clientX, mouseEvent.clientY);
        });
    });
  }

  public ngOnDestroy(): void {
    this.cursor.clearCustomCursor();
    this.isHovered = false;
    this.destroyed$.next();

    this.unlistenMouseMove();
  }

  @HostListener('mouseenter', ['$event'])
  public onMouseOver(event: MouseEvent): void {
    event.stopPropagation();

    this.isHovered = true;
    const cursor = this.getCursorToShow();

    if (cursor) {
      this.cursor.setCustomCursor(cursor.animation, cursor.options, cursor.data);
      this.setNativeCursorVisibility(false);
    } else {
      this.setNativeCursorVisibility(true);
      this.cursor.clearCustomCursor();
    }
  }

  @HostListener('mouseleave', ['$event'])
  public onMouseOut(event: MouseEvent): void {
    event.stopPropagation();

    this.isHovered = false;
    this.cursor.clearCustomCursor();
  }

  protected getCursorToShow(): AnimatedCursor | null {
    return this.cursorAnimation;
  }

  protected setCursorIcon(cursor: AnimatedCursor): void {
    if (this.isHovered && cursor) {
      this.setNativeCursorVisibility(false);
      this.cursor.setCustomCursor(cursor.animation, cursor.options, cursor.data);
    }

    if (!cursor) {
      this.setNativeCursorVisibility(true);
      this.cursor.clearCustomCursor();
    }
  }

  protected recalcCursorIcon(): void {
    const cursor = this.getCursorToShow();

    if (this.isHovered && cursor) {
      this.setCursorIcon(cursor);
      this.setNativeCursorVisibility(false);
    }

    if (!cursor) {
      this.cursor.clearCustomCursor();
      this.setNativeCursorVisibility(true);
    }
  }

  private setNativeCursorVisibility(show: boolean): void {
    this.renderer.setStyle(this.elemRef.nativeElement, 'cursor', show ? 'auto' : 'none');
  }
}
