import { Injectable } from '@angular/core';
import { MapPanCameraCenterTo, NeutralStructParams, NewDayStarted, PanMapCameraCenterAction, StructCompleted } from 'src/app/core/events';
import { MapStructure, defaultTravelPointsCost, defaultTravelPointsPerDay } from 'src/app/core/structures';
import { StoreClient, WireMethod } from 'src/app/store';
import { GameObjectsManager } from '../game-objects-manager.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';

@Injectable()
export class StructuresController extends StoreClient() {

  constructor(
    private structuresService: MwStructuresService,
    private state: State,
    private gameObjectsManager: GameObjectsManager,
  ) {
    super();
  }

  @WireMethod(StructCompleted)
  public handleCompletedStructure(event: NeutralStructParams): void {
    const structId = event.struct.id;

    this.structuresService.availableStructuresMap[structId] = true;
    this.gameObjectsManager.getObjectByFullId<MapStructure>(structId)!.visited = true;
    this.structuresService.playerCurrentLocId = structId;
    this.structuresService.updateAvailableStructures();
    this.state.currentGame.travelPoints -= defaultTravelPointsCost;

    if (this.state.currentGame.travelPoints <= 0) {
      this.state.currentGame.day += 1;
      this.state.currentGame.travelPoints += defaultTravelPointsPerDay;

      this.events.dispatch(NewDayStarted({
        day: this.state.currentGame.day
      }));
    }
  }

  @WireMethod(MapPanCameraCenterTo)
  public panMapCamera(action: PanMapCameraCenterAction): void {
    this.state.mapCamera.x = action.x;
    this.state.mapCamera.y = action.y;
  }
}
