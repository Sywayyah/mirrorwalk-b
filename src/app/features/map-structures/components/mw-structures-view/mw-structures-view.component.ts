import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MapPanCameraCenterTo, PlayerEntersTown, PlayerOpensHeroInfo, StructSelected } from 'src/app/core/events';
import { START_LOC_ID, ViewStructure } from 'src/app/core/locations';
import { Player } from 'src/app/core/players';
import { MwPlayersService, MwStructuresService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';
import { MapDragEvent } from '../map-canvas/map-canvas.component';

/* Rewamp this a bit later, along with service and the rest */
/*  Check more cases, stuff like that */
/*  also think on positioning of svg in html */

@Component({
  selector: 'mw-structures-view',
  templateUrl: './mw-structures-view.component.html',
  styleUrls: ['./mw-structures-view.component.scss'],
})
export class MwStructuresViewComponent implements AfterViewInit {
  @ViewChild('locationsContainer')
  public locationsRef!: ElementRef;

  public player: Player;

  constructor(
    private readonly playersService: MwPlayersService,
    private events: EventsService,
    public state: State,
    public readonly structsService: MwStructuresService,
    private readonly renderer: Renderer2,
  ) {
    this.player = this.playersService.getCurrentPlayer();
  }

  public ngAfterViewInit(): void {
    if (this.state.mapCamera.cameraInitialized) {
      // reset camera position for now
      // todo: maybe reset camera to location visited by the player..
      const { x, y } = this.state.mapCamera;

      this.events.dispatch(MapPanCameraCenterTo({ x, y }));
      return;
    }

    const startingStruct = this.structsService.viewStructures.find(struct => struct.id === START_LOC_ID);

    if (startingStruct) {
      this.events.dispatch(MapPanCameraCenterTo({ x: startingStruct.x, y: startingStruct.y }));
    } else {
      console.warn(`[Map View]: Couldn't find location with id ${START_LOC_ID} to pan camera center on game start`);
    }

    this.state.mapCamera.cameraInitialized = true;
  }

  public updateLocationsPosition(event: MapDragEvent): void {
    const locationsElem = this.locationsRef.nativeElement;

    this.renderer.setStyle(locationsElem, 'left', `${event.finalPosX}px`);
    this.renderer.setStyle(locationsElem, 'top', `${event.finalPosY}px`);
  }

  public onStructureSelected(struct: ViewStructure): void {
    if (!this.structsService.availableStructuresMap[struct.id] || !struct.structure || struct.structure?.isInactive) {
      return;
    }

    this.playersService.getEnemyPlayer().unitGroups = this.structsService.guardsMap[struct.id];

    this.events.dispatch(StructSelected({
      struct: struct.structure,
    }));
  }

  public goToTown(): void {
    this.events.dispatch(PlayerEntersTown());
  }

  public openPlayerInfo(): void {
    this.events.dispatch(PlayerOpensHeroInfo());
  }
}
