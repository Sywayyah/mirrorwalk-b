import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  Renderer2,
  isDevMode,
  output,
  viewChild,
} from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import {
  MapPanCameraCenterTo,
  PanMapCameraCenterAction,
} from 'src/app/core/events';
import { LevelMap } from 'src/app/core/maps';
import { injectHostElem } from 'src/app/core/utils';
import { State } from 'src/app/features/services/state.service';
import { StoreClient, WireMethod } from 'src/app/store';

export interface MapDragEvent {
  finalPosX: number;
  finalPosY: number;
}

@Component({
  selector: 'mw-map-canvas',
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss'],
  standalone: false,
})
export class MapCanvasComponent extends StoreClient() implements OnInit {
  private readonly hostElem = injectHostElem();

  readonly mapCanvasRef = viewChild.required<ElementRef>('mapCanvas');
  readonly underlayRef = viewChild.required<ElementRef>('underlay');

  public mapDragEvent = output<MapDragEvent>();

  private canvasElem!: HTMLCanvasElement;
  private canvasCtx!: CanvasRenderingContext2D;

  private underlayElem!: HTMLElement;

  private currentMap!: LevelMap;

  private cellSize: number = 0;

  private windowWidth = 0;
  private windowHeight = 0;

  private windowWidthHalf = 0;
  private windowHeightHalf = 0;

  private mapTotalWidth = 0;
  private mapTotalHeight = 0;

  private offsetX = 0;
  private offsetY = 0;

  constructor(
    private readonly state: State,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
  ) {
    super();
  }

  ngOnInit(): void {
    this.canvasElem = this.mapCanvasRef().nativeElement;
    this.canvasCtx = this.canvasElem.getContext('2d')!;

    this.underlayElem = this.underlayRef().nativeElement;

    this.currentMap = this.state.mapsState.currentMap;

    this.renderMapCellsGrid();
    this.setupWindowResizingHandling();
    this.setupMapDragging();
    this.resetCanvasPosition();
  }

  onMapClick(event: MouseEvent): void {
    if (isDevMode()) {
      console.log({
        id: 'new-id',
        x: event.clientX - this.offsetX,
        y: event.clientY - this.offsetY,
        icon: 'sword',
      });
    }
  }

  @WireMethod(MapPanCameraCenterTo)
  public panCameraCenterTo(action: PanMapCameraCenterAction): void {
    console.log(`[Map View]: Pan camera center to`, action);

    const finalPosX = -(action.x - this.windowWidthHalf);
    const finalPosY = -(action.y - this.windowHeightHalf);

    this.setMapElementsPosition(finalPosX, finalPosY);

    this.mapDragEvent.emit({ finalPosX, finalPosY });
  }

  private setupMapDragging(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.hostElem, 'mousedown')
        .pipe(
          switchMap((mouseDown) => {
            const mouseDownEvent = mouseDown as MouseEvent;
            const mapPosX = parseInt(this.canvasElem.style.left);
            const mapPosY = parseInt(this.canvasElem.style.top);

            return fromEvent(window, 'mousemove').pipe(
              map((mouseMove) => {
                const mouseMoveEvent = mouseMove as MouseEvent;

                return {
                  xDragOffset: mouseMoveEvent.clientX - mouseDownEvent.clientX,
                  yDragOffset: mouseMoveEvent.clientY - mouseDownEvent.clientY,
                  mapPosX,
                  mapPosY,
                };
              }),
              takeUntil(
                merge(
                  fromEvent(window, 'mouseup'),
                  fromEvent(window, 'onfocusout'),
                ).pipe(take(1)),
              ),
            );
          }),
          this.untilDestroyed,
        )
        .subscribe((mouseDragEvent) => {
          const screenWidthHalf = this.windowWidthHalf;
          const screenHeightHalf = this.windowHeightHalf;

          const targetPosX =
            mouseDragEvent.mapPosX + mouseDragEvent.xDragOffset;
          const targetPosY =
            mouseDragEvent.mapPosY + mouseDragEvent.yDragOffset;

          let finalPosX = targetPosX;
          let finalPosY = targetPosY;

          if (targetPosX > screenWidthHalf) {
            finalPosX = screenWidthHalf;
          } else if (targetPosX < -(this.mapTotalWidth - screenWidthHalf)) {
            finalPosX = -(this.mapTotalWidth - screenWidthHalf);
          }

          if (targetPosY > screenHeightHalf) {
            finalPosY = screenHeightHalf;
          } else if (targetPosY < -(this.mapTotalHeight - screenHeightHalf)) {
            finalPosY = -(this.mapTotalHeight - screenHeightHalf);
          }

          this.state.mapCamera.x = finalPosX * -1 + screenWidthHalf;
          this.state.mapCamera.y = finalPosY * -1 + screenHeightHalf;

          this.setMapElementsPosition(finalPosX, finalPosY);

          // Emit from ngZone.runOutsideAngular doesn't trigger cd and markForCheck
          this.mapDragEvent.emit({
            finalPosX,
            finalPosY,
          });
        });
    });
  }

  private setMapElementsPosition(x: number, y: number): void {
    this.offsetX = x;
    this.offsetY = y;

    this.renderer.setStyle(this.canvasElem, 'left', `${x}px`);
    this.renderer.setStyle(this.canvasElem, 'top', `${y}px`);
  }

  private resetCanvasPosition(): void {
    this.offsetX = 0;
    this.offsetY = 0;

    this.renderer.setStyle(this.canvasElem, 'left', `${0}px`);
    this.renderer.setStyle(this.canvasElem, 'top', `${0}px`);
  }

  private renderMapCellsGrid(): void {
    const { heightInCells, widthInCells, cellSize } = this.currentMap.mapSize;

    this.cellSize = cellSize;

    const totalWidth = widthInCells * cellSize;
    const totalHeight = heightInCells * cellSize;

    this.mapTotalWidth = totalWidth;
    this.mapTotalHeight = totalHeight;

    this.canvasElem.width = totalWidth;
    this.canvasElem.height = totalHeight;

    const canvas2d = this.canvasCtx;

    for (let horLineIndex = 0; horLineIndex <= heightInCells; horLineIndex++) {
      canvas2d.moveTo(0, horLineIndex * cellSize);
      canvas2d.lineTo(totalWidth, horLineIndex * cellSize);
    }

    for (let verLineIndex = 0; verLineIndex <= widthInCells; verLineIndex++) {
      canvas2d.moveTo(verLineIndex * cellSize, 0);
      canvas2d.lineTo(verLineIndex * cellSize, totalHeight);
    }

    canvas2d.setLineDash([5, 8]);
    canvas2d.lineWidth = 0.5;
    canvas2d.strokeStyle = 'gray';
    canvas2d.stroke();
  }

  private setupWindowResizingHandling(): void {
    this.updateWindowSizeData();
    this.updateUnderlaySize();

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(this.untilDestroyed)
        .subscribe(() => {
          this.updateWindowSizeData();
          this.updateUnderlaySize();

          this.panCameraCenterTo(this.state.mapCamera);
        });
    });
  }

  private updateWindowSizeData(): void {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;

    this.windowWidthHalf = this.windowWidth / 2;
    this.windowHeightHalf = this.windowHeight / 2;
  }

  private updateUnderlaySize(): void {
    this.renderer.setStyle(this.underlayElem, 'width', `${this.windowWidth}px`);
    this.renderer.setStyle(
      this.underlayElem,
      'height',
      `${this.windowHeight}px`,
    );
  }
}
