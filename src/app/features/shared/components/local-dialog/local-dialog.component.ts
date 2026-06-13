import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, contentChild, inject, input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'mw-local-dialog',
  imports: [],
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: `
    :host {
      display: none;
    }
  `,
})
export class LocalDialogComponent {
  readonly templateRef = contentChild.required(TemplateRef);
  readonly disableClose = input(false);
  private readonly dialog = inject(Dialog);

  private dialogRef?: DialogRef;

  open(): void {
    this.dialogRef = this.dialog.open(this.templateRef(), { disableClose: this.disableClose() });
  }

  close(): void {
    this.dialogRef?.close();
  }
}
