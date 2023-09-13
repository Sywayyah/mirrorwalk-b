import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { MapPanCameraCenterTo, PanMapCameraCenterAction } from 'src/app/core/events';
import { LevelMap } from 'src/app/core/maps';
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

  @ViewChild('fogCanvas', { static: true })
  public fogCanvasRef!: ElementRef;

  @ViewChild('underlay', { static: true })
  public underlayRef!: ElementRef;

  @Output()
  public mapDragEvent = new EventEmitter<MapDragEvent>();

  private fogCanvasElem!: HTMLCanvasElement;
  private fogCanvasCtx!: CanvasRenderingContext2D;

  private mapCanvasElem!: HTMLCanvasElement;
  private mapCanvasCtx!: CanvasRenderingContext2D;

  private underlayElem!: HTMLElement;

  private hostElem!: HTMLElement;

  private currentMap!: LevelMap;

  private cellSize: number = 0;

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

    this.mapCanvasElem = this.mapCanvasRef.nativeElement;
    this.fogCanvasElem = this.fogCanvasRef.nativeElement;

    this.mapCanvasCtx = this.mapCanvasElem.getContext('2d')!;
    this.fogCanvasCtx = this.fogCanvasElem.getContext('2d')!;

    this.underlayElem = this.underlayRef.nativeElement;

    this.currentMap = this.state.mapsState.currentMap;
    this.cellSize = this.currentMap.mapSize.cellSize;

    this.renderMapCellsGrid();
    // this.initFogCanvas();
    this.setupWindowResizingHandling();
    this.setupMapDragging();
    this.resetCanvasPosition();
  }

  private initFogCanvas(): void {
    const fogCtx = this.fogCanvasCtx;

    fogCtx.fillStyle = "rgba(0,0,0,0.5)";
    fogCtx.fillRect(0, 0, this.fogCanvasElem.width, this.fogCanvasElem.height);

    // this.revealFogWithRadius(5, 5, 3);
    const halfCell = this.cellSize / 2;
    // this.revealFogCircle(5 * this.cellSize + halfCell, 5 * this.cellSize + halfCell, 420);
    // this.revealFogCircle(6 * this.cellSize + halfCell, 6 * this.cellSize + halfCell, 420);
    setTimeout(() => {
      this.revealFogCircle(6 * this.cellSize + halfCell, 6 * this.cellSize + halfCell, 125);
    }, 0);
    setTimeout(() => {
      this.revealFogCircle(5 * this.cellSize + halfCell, 5 * this.cellSize + halfCell, 50);
    }, 2);
  }

  private revealFogCircle(
    x: number,
    y: number,
    radius: number,
    easeSteps: number = 6,
    easeRadius: number = 14,
  ): void {
    const fogCtx = this.fogCanvasCtx;

    const prevOperation = fogCtx.globalCompositeOperation;

    fogCtx.globalCompositeOperation = 'destination-out';

    const opacityStep = 1 / easeSteps;

    fogCtx.fillStyle = `rgba(0,0,0,${opacityStep * 3})`;

    for (let i = 0; i < easeSteps; i++) {

      const opacity = (i + 1) * opacityStep;

      const curRadius = radius + (i * easeRadius);
      const halfRadius = curRadius / 2;
      fogCtx.roundRect(
        x - halfRadius,
        y - halfRadius,
        curRadius,
        curRadius,
        [halfRadius]
      );
      // fogCtx.arc(x + i * 120, y, radius - (i * easeRadius), 0, 360);

      // this.fogCanvasCtx.fill();

      console.log(
        x - halfRadius,
        y - halfRadius,
        curRadius,
        curRadius,
        [halfRadius],
        `rgba(0,0,0, ${opacity})`,
      );

      // (this.fogCanvasCtx as any).reset();
      this.fogCanvasCtx.fill();
      // console.log(i, radius - (i * easeRadius), opacity);
    }


    fogCtx.globalCompositeOperation = prevOperation;

  }

  private revealFogWithRadius(x: number, y: number, radius: number = 1): void {
    this.revealFogOnCell(x, y);

    // fog corner half-tones
    this.revealFogOnCell(x - radius, y, true);
    this.revealFogOnCell(x + radius, y, true);
    this.revealFogOnCell(x, y - radius, true);
    this.revealFogOnCell(x, y + radius, true);

    const halfsSize = radius - 1;

    for (let step = 1; step < radius; step++) {
      this.revealFogOnCell(x - step, y - halfsSize + step - 1, true);
      this.revealFogOnCell(x + step, y - halfsSize + step - 1, true);

      for (let fill = 0; fill < step; fill++) {
        this.revealFogOnCell(x - step, y - halfsSize + step - 1, true);
      }
    }
  }

  private revealFogOnCell(x: number, y: number, halfTone: boolean = false): void {
    const xCellCoord = x * this.cellSize;
    const yCellCoord = y * this.cellSize;

    this.fogCanvasCtx.clearRect(xCellCoord, yCellCoord, this.cellSize, this.cellSize);
    if (halfTone) {
      this.fogCanvasCtx.fillStyle = 'rgba(0,0,0,0.4)';
      this.fogCanvasCtx.fillRect(xCellCoord, yCellCoord, this.cellSize, this.cellSize);
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
      fromEvent(this.hostElem, 'mousedown').pipe(
        switchMap((mouseDown) => {
          const mouseDownEvent = mouseDown as MouseEvent;
          const mapPosX = parseInt(this.mapCanvasElem.style.left);
          const mapPosY = parseInt(this.mapCanvasElem.style.top);

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
    this.setElementPosition(this.mapCanvasElem, x, y);
    this.setElementPosition(this.fogCanvasElem, x, y);
  }

  private resetCanvasPosition(): void {
    this.setElementPosition(this.mapCanvasElem, 0, 0);
    this.setElementPosition(this.fogCanvasElem, 0, 0);
  }

  private setElementPosition(elem: HTMLElement, x: number, y: number): void {
    this.renderer.setStyle(elem, 'left', `${x}px`);
    this.renderer.setStyle(elem, 'top', `${y}px`);
  }

  private renderMapCellsGrid(): void {
    const { heightInCells, widthInCells, cellSize } = this.currentMap.mapSize;


    const totalWidth = widthInCells * cellSize;
    const totalHeight = heightInCells * cellSize;

    this.mapTotalWidth = totalWidth;
    this.mapTotalHeight = totalHeight;

    this.setCanvasElementsSizes(totalWidth, totalHeight);

    const canvas2d = this.mapCanvasCtx;

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
    canvas2d.strokeStyle = "gray";
    canvas2d.stroke();
  }

  private setCanvasElementsSizes(totalWidth: number, totalHeight: number): void {
    this.mapCanvasElem.width = totalWidth;
    this.mapCanvasElem.height = totalHeight;

    this.fogCanvasElem.width = totalWidth;
    this.fogCanvasElem.height = totalHeight;
  }

  private setupWindowResizingHandling(): void {
    this.updateWindowSizeData();
    this.updateUnderlaySize();

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize').pipe(this.untilDestroyed).subscribe(() => {
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
    this.renderer.setStyle(this.underlayElem, 'height', `${this.windowHeight}px`);
  }
}
