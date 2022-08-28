import { Injectable } from "@angular/core";
import { CustomAnimationData, EffectAnimation, EffectOptions } from "src/app/core/model/vfx-api/vfx-api.types";
import { CustomCursorComponent } from "./custom-cursor.component";


@Injectable({
    providedIn: 'root'
})
export class CursorService {
    private cursorComponent!: CustomCursorComponent;

    constructor() {}

    public registerCursorComponent(component: CustomCursorComponent): void {
        this.cursorComponent = component;
    }

    public setCustomCursor(
        animation: EffectAnimation,
        options?: EffectOptions,
        data?: CustomAnimationData,
    ): void {
        this.cursorComponent.showCustomCursor = true;
        this.cursorComponent.cdr.detectChanges();
        this.cursorComponent.customCursorRef.clearAnimation();
        this.cursorComponent.customCursorRef.playAnimation(animation, options, data);
    }

    public setCustomCursorPos(x: number, y: number): void {
        this.cursorComponent.customCursorPos.x = x;
        this.cursorComponent.customCursorPos.y = y;
    }

    public clearCustomCursor(): void {
        this.cursorComponent.cdr.detectChanges();
        if (this.cursorComponent.customCursorRef) {
            this.cursorComponent.customCursorRef.clearAnimation();
            this.cursorComponent.showCustomCursor = false;
        }
    }
}