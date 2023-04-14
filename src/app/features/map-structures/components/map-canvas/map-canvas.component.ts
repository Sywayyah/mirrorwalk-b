import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { CELL_SIZE, LevelMap } from 'src/app/core/maps';
import { MwStructuresService } from 'src/app/features/services';
import { MapPanCamera } from 'src/app/features/services/events';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

export interface MapDragEvent {
  finalPosX: number;
  finalPosY: number;
}

@Component({
  selector: 'mw-map-canvas',
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss']
})
export class MapCanvasComponent implements OnInit {
  @ViewChild('mapCanvas', { static: true })
  public mapCanvasRef!: ElementRef;

  @Output()
  public mapDragEvent = new EventEmitter<MapDragEvent>();

  private canvasElem!: HTMLCanvasElement;
  private canvasCtx!: CanvasRenderingContext2D;

  private currentMap: LevelMap = this.state.mapsState.currentMap;

  private mapTotalWidth = 0;
  private mapTotalHeight = 0;

  constructor(
    private readonly state: State,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
    private readonly structsService: MwStructuresService,
    private readonly events: EventsService,
  ) { }

  ngOnInit(): void {
    this.canvasElem = this.mapCanvasRef.nativeElement;
    this.canvasCtx = this.canvasElem.getContext('2d')!;

    this.renderMapCellsGrid();
    this.setUpMapDragging();
    this.resetCanvasPosition();
    // ideally, this should be underlying elem, not body
    // document.querySelector('body')!.style.background = 'gainsboro';

    this.events.onEvent(MapPanCamera).subscribe((event) => {
      this.panCamera(event.x, event.y);
      this.mapDragEvent.emit({ finalPosX: event.x, finalPosY: event.y });
    });

    const startingStruct = this.structsService.viewStructures.find(struct => struct.id === '1');

    if (startingStruct) {
      console.log('----->', startingStruct.x, startingStruct.y);
      // setTimeout(() => {
      //   this.events.dispatch(MapPanCamera({ x: startingStruct.x, y: startingStruct.y }));
      // }, 0);
    } else {
      throw new Error('Cannot find location with Id 1 to Pan Camera automatically');
    }

  }

  private setUpMapDragging(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.canvasElem, 'mousedown').pipe(
        switchMap((mouseDown) => {
          const mouseDownEvent = mouseDown as MouseEvent;
          console.log(this.canvasElem.style.left)
          const mapPosX = parseInt(this.canvasElem.style.left);
          const mapPosY = parseInt(this.canvasElem.style.top);

          return fromEvent(this.canvasElem, 'mousemove').pipe(
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
      ).subscribe(mouseDragEvent => {
        // can be calculated on window resize event and stored as props
        const screenWidthHalf = window.innerWidth / 2;
        const screenHeightHalf = window.innerHeight / 2;

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


        this.state.mapsState.cameraPos.x = finalPosX;
        this.state.mapsState.cameraPos.y = finalPosY;

        this.panCamera(finalPosX, finalPosY);

        // interestingly enough. It looks like having emit inside
        //  run outside Angular doesn't cause CD to trigger.
        this.mapDragEvent.emit({
          finalPosX,
          finalPosY,
        });
      });
    });
  }

  private panCamera(x: number, y: number): void {
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
}
