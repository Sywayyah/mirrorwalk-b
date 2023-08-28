import { Injectable } from '@angular/core';
import { MapPanCameraCenterTo, NeutralStructParams, NewDayStarted, NewWeekStarted, PanMapCameraCenterAction, StructCompleted } from 'src/app/core/events';
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

    const currentGame = this.state.currentGame;

    currentGame.travelPoints -= defaultTravelPointsCost;

    if (currentGame.travelPoints <= 0) {
      currentGame.day += 1;
      currentGame.travelPoints += defaultTravelPointsPerDay;

      this.events.dispatch(NewDayStarted({
        day: currentGame.day
      }));

      if ((currentGame.day % 7) === 0) {
        currentGame.week += 1;
        currentGame.day = 1;

        this.events.dispatch(NewWeekStarted({ week: currentGame.week }));
      }
    }
  }

  @WireMethod(MapPanCameraCenterTo)
  public panMapCamera(action: PanMapCameraCenterAction): void {
    this.state.mapCamera.x = action.x;
    this.state.mapCamera.y = action.y;
  }
}
