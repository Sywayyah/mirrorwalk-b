import { Injectable } from '@angular/core';
import { StructureDescription, ViewStructure, START_LOC_ID } from 'src/app/core/locations';
import { Player } from 'src/app/core/players';
import { StructureGeneratorModel, StructureModel, StructureTypeEnum } from 'src/app/core/structures';
import { GamePreparedEvent } from 'src/app/core/events';
import { UnitGroup } from 'src/app/core/unit-types';
import { MwPlayersService, MwUnitGroupsService } from './';
import { GameObjectsManager } from './game-objects-manager.service';

@Injectable({
  providedIn: 'root'
})
export class MwStructuresService {

  /*
   todo: revisit this complicated structures logic, introduce maps/locations
  */
  public neutralPlayer!: Player;

  public initialStructs: StructureDescription[] = [];

  public playerCurrentLocId!: string;

  public viewStructures!: ViewStructure[];

  public availableStructuresMap: Record<string, true> = {};

  public guardsMap!: Record<string, UnitGroup[]>;

  public currentStruct!: StructureModel;

  public structsMap = new Map<string, ViewStructure>();

  constructor(
    private playersService: MwPlayersService,
    private unitGroups: MwUnitGroupsService,
    private gameObjectsManager: GameObjectsManager,
  ) { }

  public initStructures(event: GamePreparedEvent): void {
    this.neutralPlayer = this.playersService.getNeutralPlayer();

    this.initialStructs = event.map.structures;
    this.viewStructures = this.createViewStructures(this.initialStructs);
    this.viewStructures.forEach((struct) => this.structsMap.set(struct.id, struct));
    this.playerCurrentLocId = START_LOC_ID;
    this.updateParentLinks();
    this.updateAvailableStructures();
    this.guardsMap = this.generateNewGuardsMap();
    console.log('guardsMap', this.guardsMap);
  }

  public updateParentLinks(): void {
    this.viewStructures.forEach((struct) => {
      const parentLocs = this.viewStructures.filter(structItem => struct.pathTo === structItem.id);
      parentLocs.forEach(parent => struct.parentStructs.add(parent.id));
    });
  }

  public updateAvailableStructures(): void {
    Object.keys(this.availableStructuresMap).forEach(structId => {
      const childStructures = this.viewStructures.filter(struct => [...struct.parentStructs].find(parentId => this.structsMap.get(parentId)?.visited) && struct.parentStructs.has(structId));
      childStructures.forEach(struct => this.availableStructuresMap[struct.id] = true);
    });
  }

  private createViewStructures(init: StructureDescription[]): ViewStructure[] {
    return init.map((struct) => {
      const viewStrcuture: ViewStructure = {
        id: struct.id,
        icon: struct.icon,
        x: struct.x,
        y: struct.y,
        parentStructs: new Set(),
      };

      const pathTo = struct.pathTo;

      if (struct.struct) {
        viewStrcuture.structure = this.createStructure(struct.id, struct.struct);
        console.log('view structure: ', viewStrcuture.structure);
      }

      if (struct.isRoot) {
        viewStrcuture.isRoot = true;
        viewStrcuture.visited = true;
        this.availableStructuresMap[struct.id] = true;
      }

      if (pathTo) {
        const linkedLoc = init.find(struct2 => struct2.id === struct.pathTo)!;
        viewStrcuture.pathTo = pathTo;

        // mappedLocation.pathTo = [linkedLoc.x, linkedLoc.y];

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
      }

      return viewStrcuture;
    });
  }

  private createStructure(structId: string, structureType: StructureGeneratorModel): StructureModel {
    if (structureType.generateGuard && structureType.generateReward) {
      const newStructure = this.gameObjectsManager.createNewGameObject(StructureModel, {
        generator: structureType,
        guardingPlayer: this.neutralPlayer,
        type: StructureTypeEnum.NeutralCamp,
      }, structId);

      return newStructure;
    }

    if (!structureType.generateGuard && structureType.generateReward) {
      const newStructure = this.gameObjectsManager.createNewGameObject(StructureModel, {
        generator: structureType,
        type: StructureTypeEnum.NeutralSite,
      }, structId);

      return newStructure;
    }

    if (structureType.onVisited) {
      const neutralSiteStructure = this.gameObjectsManager.createNewGameObject(StructureModel, {
        generator: structureType,
        type: StructureTypeEnum.NeutralSite,
      }, structId);

      return neutralSiteStructure;
    }

    // change it later
    return null as any;
  }

  private generateNewGuardsMap(): Record<string, UnitGroup[]> {
    const guardsMap: Record<string, UnitGroup[]> = {};

    this.initialStructs.forEach(struct => {
      if (struct.struct) {
        guardsMap[struct.id] = struct.struct.generateGuard
          ? this.unitGroups.createUnitGroupFromGenModelForPlayer(
            struct.struct.generateGuard(),
            this.neutralPlayer,
          ) as UnitGroup[]
          : [];
      }
    });

    return guardsMap;
  }
}
