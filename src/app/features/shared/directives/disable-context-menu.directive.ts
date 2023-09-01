import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/* todo: In theory, some custom menu can be shown */
@Directive({
  selector: '[mwNoContextMenu], [mwUnitGroupCombatAction]',
})
export class DisableContextMenuDirective {
  @Output()
  mwNoContextMenu = new EventEmitter();

  @HostListener('contextmenu', ['$event'])
  preventContextMenu(event: MouseEvent): boolean {
    event.stopPropagation();
    event.preventDefault();
    this.mwNoContextMenu.emit();
    return false;
  }
}