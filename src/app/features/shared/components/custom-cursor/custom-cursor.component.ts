import { Component, inject, ViewChild } from '@angular/core';
import { injectCdr } from 'src/app/core/utils';
import { VfxElementComponent } from '../vfx-element/vfx-element.component';
import { CursorService } from './cursor.service';

@Component({
  selector: 'mw-custom-cursor',
  templateUrl: './custom-cursor.component.html',
  styleUrls: ['./custom-cursor.component.scss'],
  standalone: false
})
export class CustomCursorComponent {
  private readonly cursor = inject(CursorService);
  public readonly cdr = injectCdr();

  @ViewChild('customCursorRef', { static: false })
  public customCursorRef!: VfxElementComponent;

  public showCustomCursor: boolean = false;

  public customCursorPos: { x: number, y: number } = { x: 0, y: 0 };

  constructor() {
    this.cursor.registerCursorComponent(this);
  }
}
