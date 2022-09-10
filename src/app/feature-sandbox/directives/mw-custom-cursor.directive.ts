import { Directive, ElementRef, HostListener, NgZone, OnDestroy, Renderer2 } from '@angular/core';
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

  private unlistenMouseMove!: () => void;

  constructor(
    protected cursor: CursorService,
    protected elemRef: ElementRef,
    protected renderer: Renderer2,
    protected ngZone: NgZone,
  ) {
    this.showCursorForHostElem(false);

    ngZone.runOutsideAngular(() => {
      this.unlistenMouseMove = renderer.listen(elemRef.nativeElement, 'mousemove', (mouseEvent: MouseEvent) => {
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

  @HostListener('mouseleave')
  public onMouseOut(): void {
    this.isHovered = false;
    this.cursor.clearCustomCursor();
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
