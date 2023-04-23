import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { VfxElementComponent } from '../vfx-element/vfx-element.component';
import { CursorService } from './cursor.service';

@Component({
  selector: 'mw-custom-cursor',
  templateUrl: './custom-cursor.component.html',
  styleUrls: ['./custom-cursor.component.scss']
})
export class CustomCursorComponent {

  @ViewChild('customCursorRef', { static: false })
  public customCursorRef!: VfxElementComponent;

  public showCustomCursor: boolean = false;

  public customCursorPos: { x: number, y: number } = { x: 0, y: 0 };

  constructor(
    private cursor: CursorService,
    public cdr: ChangeDetectorRef,
  ) {
    this.cursor.registerCursorComponent(this);
  }
}
