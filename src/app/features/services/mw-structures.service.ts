import { inject, Injectable } from '@angular/core';
import { GamePreparedEvent, InitStructure } from 'src/app/core/events';
import { Player } from 'src/app/core/players';
import { MapStructure, StructureDescription } from 'src/app/core/structures';
import { EventsService } from 'src/app/store';
import { MwPlayersService, MwUnitGroupsService } from './';
import { GameObjectsManager } from './game-objects-manager.service';

@Injectable({
  providedIn: 'root',
})
export class MwStructuresService {
  private readonly playersService = inject(MwPlayersService);
  private readonly unitGroups = inject(MwUnitGroupsService);
  private readonly gameObjectsManager = inject(GameObjectsManager);
  private readonly events = inject(EventsService);

  public neutralPlayer!: Player;

  public initialStructs: StructureDescription[] = [];

  public playerCurrentLocId!: string;

  public viewStructures!: MapStructure[];

  public availableStructuresMap: Record<string, true> = {};

  public currentStruct!: MapStructure;

  private startingLocationId!: string;

  public initStructures(event: GamePreparedEvent): void {
    this.neutralPlayer = this.playersService.getNeutralPlayer();

    this.initialStructs = event.map.structures;
    this.startingLocationId = event.map.startingLocId;
    this.playerCurrentLocId = this.gameObjectsManager.getObjectId(MapStructure, this.startingLocationId);
    this.viewStructures = this.createViewStructures(this.initialStructs);
    this.updateParentLinks();
    this.updateAvailableStructures();
  }

  public updateParentLinks(): void {
    this.viewStructures.forEach((struct) => {
      const parentLocs = this.viewStructures.filter((structItem) => struct.pathTo === structItem.id);
      parentLocs.forEach((parent) => struct.parentStructs.add(parent.id));
    });
  }

  public updateAvailableStructures(): void {
    Object.keys(this.availableStructuresMap).forEach((structId) => {
      const childStructures = this.viewStructures.filter(
        (struct) =>
          [...struct.parentStructs].find(
            (parentId) =>
              this.gameObjectsManager.getObjectByFullId<MapStructure>(
                this.gameObjectsManager.getObjectId(MapStructure, parentId),
              )?.visited,
          ) && struct.parentStructs.has(structId),
      );

      childStructures.forEach((struct) => (this.availableStructuresMap[struct.id] = true));
    });
  }

  private createViewStructures(initialStructures: StructureDescription[]): MapStructure[] {
    const createdStructures = initialStructures.map((struct) =>
      this.gameObjectsManager.createNewGameObject(
        MapStructure,
        {
          iconName: struct.icon,
          x: struct.x,
          y: struct.y,
          generator: struct.struct,
          guardingPlayer: undefined,
          isRoot: struct.id === this.startingLocationId,
          pathTo: struct.pathTo ? this.gameObjectsManager.getObjectId(MapStructure, struct.pathTo) : undefined,
          actionPoints: struct.actionPoints,
          structParams: struct.structParams,
        },
        struct.id,
      ),
    );

    return createdStructures.map((viewStrcuture) => {
      this.events.dispatch(InitStructure({ structure: viewStrcuture }));

      const pathTo = viewStrcuture.pathTo;

      if (viewStrcuture.isRoot) {
        viewStrcuture.isRoot = true;
        viewStrcuture.visited = true;
        this.availableStructuresMap[viewStrcuture.id] = true;
      }

      if (pathTo) {
        const linkedLoc = createdStructures.find((struct2) => struct2.id === viewStrcuture.pathTo)!;
        viewStrcuture.pathTo = pathTo;

        const { x, y } = viewStrcuture;

        const lowestX = Math.min(x, linkedLoc.x);
        const lowestY = Math.min(y, linkedLoc.y);

        const latestX = Math.max(x, linkedLoc.x);
        const latestY = Math.max(y, linkedLoc.y);

        const height = latestY - lowestY;
        const width = latestX - lowestX;

        viewStrcuture.svg = {
          x: lowestX,
          y: lowestY,
          height: height,
          width: width,

          ox: linkedLoc.x > x ? width : 0,
          oy: linkedLoc.y > y ? height : 0,
          tx: x < linkedLoc.x ? 0 : width,
          ty: y < linkedLoc.y ? 0 : height,
        };

        const generator = viewStrcuture.generator;

        if (generator?.generateGuard) {
          viewStrcuture.guard = this.unitGroups.createUnitGroupFromGenModel(
            generator.generateGuard({ thisStruct: viewStrcuture }),
          );
          viewStrcuture.guard.forEach((guard) => guard.assignOwnerPlayer(this.playersService.getNeutralPlayer()));
          viewStrcuture.guardingPlayer = this.playersService.getNeutralPlayer();
        }

        if (generator?.generateReward) {
          viewStrcuture.reward = generator.generateReward();
        }
      }

      return viewStrcuture;
    });
  }
}
