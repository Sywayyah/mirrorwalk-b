import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { CELL_SIZE, LevelMap } from 'src/app/core/maps';
import { MapPanCameraCenterTo, PanMapCameraCenterAction } from 'src/app/features/services/events';
import { State } from 'src/app/features/services/state.service';
import { StoreClient, WireMethod } from 'src/app/store';

export interface MapDragEvent {
  finalPosX: number;
  finalPosY: number;
}

@Component({
  selector: 'mw-map-canvas',
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss']
})
export class MapCanvasComponent extends StoreClient() implements OnInit {
  @ViewChild('mapCanvas', { static: true })
  public mapCanvasRef!: ElementRef;

  @ViewChild('underlay', { static: true })
  public underlayRef!: ElementRef;

  @Output()
  public mapDragEvent = new EventEmitter<MapDragEvent>();

  private canvasElem!: HTMLCanvasElement;
  private canvasCtx!: CanvasRenderingContext2D;

  private underlayElem!: HTMLElement;

  private hostElem!: HTMLElement;

  private currentMap: LevelMap = this.state.mapsState.currentMap;

  private windowWidth = 0;
  private windowHeight = 0;

  private windowWidthHalf = 0;
  private windowHeightHalf = 0;

  private mapTotalWidth = 0;
  private mapTotalHeight = 0;

  constructor(
    private readonly hostRef: ElementRef,
    private readonly state: State,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
  ) {
    super();
  }

  ngOnInit(): void {
    this.hostElem = this.hostRef.nativeElement;

    this.canvasElem = this.mapCanvasRef.nativeElement;
    this.canvasCtx = this.canvasElem.getContext('2d')!;

    this.underlayElem = this.underlayRef.nativeElement;

    this.renderMapCellsGrid();
    this.setupWindowResizingHandling();
    this.setupMapDragging();
    this.resetCanvasPosition();
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
      fromEvent(this.hostElem, 'mousedown').pipe(
        switchMap((mouseDown) => {
          const mouseDownEvent = mouseDown as MouseEvent;
          const mapPosX = parseInt(this.canvasElem.style.left);
          const mapPosY = parseInt(this.canvasElem.style.top);

          return fromEvent(window, 'mousemove').pipe(
            map((mouseMove) => {
              const mouseMoveEvent = mouseMove as MouseEvent;

              return ({
                xDragOffset: mouseMoveEvent.clientX - mouseDownEvent.clientX,
                yDragOffset: mouseMoveEvent.clientY - mouseDownEvent.clientY,
                mapPosX,
                mapPosY,
              });
            }),
            takeUntil(merge(fromEvent(window, 'mouseup'), fromEvent(window, 'onfocusout')).pipe(take(1)))
          );
        }),
        this.untilDestroyed,
      ).subscribe(mouseDragEvent => {
        const screenWidthHalf = this.windowWidthHalf;
        const screenHeightHalf = this.windowHeightHalf;

        const targetPosX = mouseDragEvent.mapPosX + mouseDragEvent.xDragOffset;
        const targetPosY = mouseDragEvent.mapPosY + mouseDragEvent.yDragOffset;

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

        this.state.mapsState.cameraCenterPos.x = finalPosX * -1 + screenWidthHalf;
        this.state.mapsState.cameraCenterPos.y = finalPosY * -1 + screenHeightHalf;

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
    this.renderer.setStyle(this.canvasElem, 'left', `${x}px`);
    this.renderer.setStyle(this.canvasElem, 'top', `${y}px`);
  }

  private resetCanvasPosition(): void {
    this.renderer.setStyle(this.canvasElem, 'left', `${0}px`);
    this.renderer.setStyle(this.canvasElem, 'top', `${0}px`);
  }

  private renderMapCellsGrid(): void {
    const { heightInCells, widthInCells } = this.currentMap.mapSize;
    const totalWidth = widthInCells * CELL_SIZE;
    const totalHeight = heightInCells * CELL_SIZE;

    this.mapTotalWidth = totalWidth;
    this.mapTotalHeight = totalHeight;

    this.canvasElem.width = totalWidth;
    this.canvasElem.height = totalHeight;


    const canvas2d = this.canvasCtx;

    for (let horLineIndex = 0; horLineIndex <= heightInCells; horLineIndex++) {
      canvas2d.moveTo(0, horLineIndex * CELL_SIZE);
      canvas2d.lineTo(totalWidth, horLineIndex * CELL_SIZE);
    }

    for (let verLineIndex = 0; verLineIndex <= widthInCells; verLineIndex++) {
      canvas2d.moveTo(verLineIndex * CELL_SIZE, 0);
      canvas2d.lineTo(verLineIndex * CELL_SIZE, totalHeight);
    }

    canvas2d.setLineDash([5, 8]);
    canvas2d.lineWidth = 0.5;
    canvas2d.strokeStyle = "gray";
    canvas2d.stroke();
  }

  private setupWindowResizingHandling(): void {
    this.updateWindowSizeData();
    this.updateUnderlaySize();

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').pipe(this.untilDestroyed).subscribe(() => {
        this.updateWindowSizeData();
        this.updateUnderlaySize();

        const cameraState = this.state.mapsState.cameraCenterPos;
        this.panCameraCenterTo(cameraState);
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
    this.renderer.setStyle(this.underlayElem, 'height', `${this.windowHeight}px`);
  }
}
