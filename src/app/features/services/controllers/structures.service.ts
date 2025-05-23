import { inject, Injectable } from '@angular/core';
import { GameCommandEvents, MapPanCameraCenterTo, NeutralStructParams, NewDayStarted, NewWeekStarted, PanMapCameraCenterAction, RemoveActionPoints, StructCompleted } from 'src/app/core/events';
import { defaultActionPointsPerDay, MapStructure } from 'src/app/core/structures';
import { StoreClient, WireMethod } from 'src/app/store';
import { GameObjectsManager } from '../game-objects-manager.service';
import { MwStructuresService } from '../mw-structures.service';
import { State } from '../state.service';

@Injectable()
export class StructuresController extends StoreClient() {
  private structuresService = inject(MwStructuresService);
  private state = inject(State);
  private gameObjectsManager = inject(GameObjectsManager);

  @WireMethod(RemoveActionPoints)
  public removeActionPoints({ points }: GameCommandEvents['RemoveActionPoints']): void {
    const currentGame = this.state.currentGame;

    currentGame.actionPoints -= points;

    if (currentGame.actionPoints <= 0) {
      currentGame.day += 1;
      currentGame.globalDay += 1;
      currentGame.actionPoints += defaultActionPointsPerDay;

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

  @WireMethod(StructCompleted)
  public handleCompletedStructure(event: NeutralStructParams): void {
    const structId = event.struct.id;

    this.structuresService.availableStructuresMap[structId] = true;
    this.gameObjectsManager.getObjectByFullId<MapStructure>(structId)!.visited = true;
    this.structuresService.playerCurrentLocId = structId;
    this.structuresService.updateAvailableStructures();

    this.events.dispatch(RemoveActionPoints({ points: event.struct.actionPoints }));
  }

  @WireMethod(MapPanCameraCenterTo)
  public panMapCamera(action: PanMapCameraCenterAction): void {
    this.state.mapCamera.x = action.x;
    this.state.mapCamera.y = action.y;
  }
}
