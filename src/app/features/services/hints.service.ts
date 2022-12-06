import { Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HintsContainerComponent, MenuComponent } from '../shared/components';

@Injectable({
  providedIn: 'root',
})
export class HintsService {
  public containerRef!: HintsContainerComponent;

  public activeMenusCount: number = 0;

  public activeMenus: Set<MenuComponent> = new Set();

  public clickOutsideMenu$ = fromEvent(window, 'click').pipe(
    filter(() => this.activeMenusCount > 0),
  );

  constructor() {
    this.clickOutsideMenu$.subscribe((event) => {
      const target = event.target as HTMLElement;
      const targetedMenu = target.closest('.menu-hint');
      const targetedMenuHost = target.closest('mw-menu');

      if (!targetedMenu && !targetedMenuHost) {
        this.closeAllActiveMenus();
      }

      if (!(targetedMenuHost)) {
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
