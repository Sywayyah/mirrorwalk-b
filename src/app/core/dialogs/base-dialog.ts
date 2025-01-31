import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { inject } from '@angular/core';

export class BaseDialog<T extends object = {}> {
  readonly dialogData = inject<T>(DIALOG_DATA);
  readonly dialogRef = inject(DialogRef);

  close(): void {
    this.dialogRef.close();
  }
}
