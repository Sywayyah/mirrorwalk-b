import { Injectable } from "@angular/core";
import { EffectAnimation, EffectOptions, CustomAnimationData } from 'src/app/core/api/vfx-api';
import { CustomCursorComponent } from "./custom-cursor.component";


@Injectable({
  providedIn: 'root'
})
export class CursorService {
  private cursorComponent!: CustomCursorComponent;

  constructor() { }

  public registerCursorComponent(component: CustomCursorComponent): void {
    this.cursorComponent = component;
  }

  public setCustomCursor(
    animation: EffectAnimation,
    options?: EffectOptions,
    data?: CustomAnimationData,
  ): void {
    this.cursorComponent.showCustomCursor = true;
    this.updateCursorComponent();
    this.cursorComponent.customCursorRef.clearAnimation();
    this.cursorComponent.customCursorRef.playAnimation(animation, options, data);
  }

  public setCustomCursorPos(x: number, y: number): void {
    this.cursorComponent.customCursorPos.x = x;
    this.cursorComponent.customCursorPos.y = y;
    this.updateCursorComponent();
  }

  public clearCustomCursor(): void {
    this.updateCursorComponent();
    if (this.cursorComponent.customCursorRef) {
      this.cursorComponent.customCursorRef.clearAnimation();
      this.cursorComponent.showCustomCursor = false;
    }
  }

  private updateCursorComponent(): void {
    this.cursorComponent.cdr.detectChanges();
  }
}
