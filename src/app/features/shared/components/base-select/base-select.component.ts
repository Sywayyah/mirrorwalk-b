import { Component, model } from '@angular/core';

@Component({
  selector: 'mw-base-select',
  templateUrl: './base-select.component.html',
  styleUrl: './base-select.component.scss',
  standalone: false,
})
export class BaseSelectComponent<T> {
  readonly selectedItem = model<T>();
}
