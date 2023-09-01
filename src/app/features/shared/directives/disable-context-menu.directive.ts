import { Directive, HostListener } from '@angular/core';

/* todo: In theory, some custom menu can be shown */
@Directive({
  selector: '[mwNoContextMenu], [mwUnitGroupCombatAction]',
})
export class DisableContextMenuDirective {
  @HostListener('contextmenu', ['$event'])
  preventContextMenu(event: MouseEvent): boolean {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }
}