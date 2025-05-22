import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HintsContainerComponent, MenuComponent } from '../shared/components';

@Injectable({
  providedIn: 'root',
})
export class HintsService {
  containerRef!: HintsContainerComponent;

  activeMenusCount: number = 0;

  readonly activeMenus: Set<MenuComponent> = new Set();

  readonly clickOutsideMenu$ = fromEvent(window, 'click').pipe(filter(() => this.activeMenusCount > 0));

  constructor() {
    // Some glitch with menu + hover hints inside.. happens sometimes
    // Menu also starts to close on hover, and hints are closing shortly
    // after opened
    // I found reason - click itself.
    this.clickOutsideMenu$.subscribe((event) => {
      const target = event.target as HTMLElement;
      const targetedMenu = target.closest('.menu-hint');
      const targetedMenuHost = target.closest('mw-menu');

      if (!targetedMenu && !targetedMenuHost) {
        this.closeAllActiveMenus();
      }

      if (!targetedMenuHost) {
        this.closeClosableMenus();
      }
    });
  }

  public closeAllActiveMenus(): void {
    this.activeMenus.forEach((menuComponent) => this.containerRef.removeHint(menuComponent.currentHintRef!));
    this.activeMenus.clear();
  }

  public closeClosableMenus(): void {
    this.activeMenus.forEach((menuComponent) => {
      if (menuComponent.closeOnClick) {
        this.containerRef.removeHint(menuComponent.currentHintRef!);
      }
      this.activeMenus.delete(menuComponent);
    });
  }
}
