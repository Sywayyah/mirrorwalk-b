import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CONFIG } from 'src/app/core/config';
import { MapPanCameraCenterTo, OpenMainMenu, StructSelected } from 'src/app/core/events';
import { Player } from 'src/app/core/players';
import { MapStructure } from 'src/app/core/structures';
import { MwPlayersService, MwStructuresService } from 'src/app/features/services';
import { GameObjectsManager } from 'src/app/features/services/game-objects-manager.service';
import { State } from 'src/app/features/services/state.service';
import { StoreClient } from 'src/app/store';
import { MapDragEvent } from '../map-canvas/map-canvas.component';
import { onEscape } from 'src/app/features/services/utils/keys.util';

/* Rewamp this a bit later, along with service and the rest */
/*  Check more cases, stuff like that */
/*  also think on positioning of svg in html */

@Component({
  selector: 'mw-structures-view',
  templateUrl: './mw-structures-view.component.html',
  styleUrls: ['./mw-structures-view.component.scss'],
})
export class MwStructuresViewComponent extends StoreClient() implements AfterViewInit {

  @ViewChild('locationsContainer')
  public locationsRef!: ElementRef;

  public player: Player;

  public isLocIdVisible = CONFIG.showLocationsIds;

  constructor(
    private readonly playersService: MwPlayersService,
    public state: State,
    public readonly structsService: MwStructuresService,
    private readonly renderer: Renderer2,
    private gameObjectsManager: GameObjectsManager,
  ) {
    super();

    this.player = this.playersService.getCurrentPlayer();

    onEscape(() => {
      if (!this.state.mainMenu.isOpen) {
        this.events.dispatch(OpenMainMenu());
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.state.mapCamera.cameraInitialized) {
      // reset camera position for now
      // todo: maybe reset camera to location visited by the player..
      const { x, y } = this.state.mapCamera;

      this.events.dispatch(MapPanCameraCenterTo({ x, y }));
      return;
    }

    const startLocId = this.state.mapsState.currentMap.startingLocId;

    const startingStruct = this.gameObjectsManager.getObjectById(MapStructure, startLocId);

    if (startingStruct) {
      this.events.dispatch(MapPanCameraCenterTo({ x: startingStruct.x, y: startingStruct.y }));
    } else {
      console.warn(`[Map View]: Couldn't find location with id ${startLocId} to pan camera center on game start`);
    }

    this.state.mapCamera.cameraInitialized = true;
  }

  public updateLocationsPosition(event: MapDragEvent): void {
    const locationsElem = this.locationsRef.nativeElement;

    this.renderer.setStyle(locationsElem, 'left', `${event.finalPosX}px`);
    this.renderer.setStyle(locationsElem, 'top', `${event.finalPosY}px`);
  }

  public onStructureSelected(struct: MapStructure): void {
    if (!this.structsService.availableStructuresMap[struct.id] || !struct.generator || struct.isInactive) {
      return;
    }

    if (struct.guard) {
      this.playersService.getEnemyPlayer().hero.setUnitGroups(struct.guard);
    }

    this.events.dispatch(StructSelected({
      struct: struct,
    }));
  }
}
