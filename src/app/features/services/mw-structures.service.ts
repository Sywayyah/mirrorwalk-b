import { Injectable } from '@angular/core';
import { StructureDescription, ViewStructure } from 'src/app/core/locations';
import { PlayerInstanceModel } from 'src/app/core/players';
import { NeutralCampStructure, NeutralSite, StructureGeneratorModel, StructureModel, StructureTypeEnum } from 'src/app/core/structures';
import { GamePreparationFinished, GamePreparedEvent } from 'src/app/core/triggers';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { StoreClient, WireMethod } from 'src/app/store';
import { MwPlayersService, MwUnitGroupsService } from './';

@Injectable({
  providedIn: 'root'
})
export class MwStructuresService extends StoreClient() {

  /*
   todo: revisit this complicated structures logic, introduce maps/locations
  */
  public neutralPlayer!: PlayerInstanceModel;

  public initialStructs: StructureDescription[] = [];

  public playerCurrentLocId!: string;

  public viewStructures!: ViewStructure[];

  public availableStructuresMap: Record<string, true> = {};

  public guardsMap!: Record<string, UnitGroupInstModel[]>;

  public currentStruct!: StructureModel;

  public structsMap = new Map<string, ViewStructure>();

  constructor(
    private playersService: MwPlayersService,
    private unitGroups: MwUnitGroupsService,
  ) {
    super();
  }

  @WireMethod(GamePreparationFinished)
  public initStructures(event: GamePreparedEvent): void {
    this.neutralPlayer = this.playersService.getNeutralPlayer();

    this.initialStructs = event.structures;
    this.viewStructures = this.createViewStructures(this.initialStructs);
    this.viewStructures.forEach((struct) => this.structsMap.set(struct.id, struct));
    this.playerCurrentLocId = '1';
    this.updateParentLinks();
    this.updateAvailableStructures();
    this.guardsMap = this.generateNewGuardsMap();
    console.log(this.guardsMap);
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
      const newStructure: NeutralCampStructure = {
        id: structId,
        generator: structureType,
        type: StructureTypeEnum.NeutralCamp,
        reward: structureType.generateReward(),
        guard: this.neutralPlayer,
      };

      return newStructure;
    }

    if (!structureType.generateGuard && structureType.generateReward) {
      const newStructure: NeutralSite = {
        id: structId,
        generator: structureType,
        type: StructureTypeEnum.NeutralSite,
        reward: structureType.generateReward(),
      };

      return newStructure;
    }

    if (structureType.onVisited) {
      const neutralSiteStructure: NeutralSite = {
        id: structId,
        generator: structureType,
        type: StructureTypeEnum.NeutralSite,
      };

      return neutralSiteStructure;
    }

    // change it later
    return null as any;
  }

  private generateNewGuardsMap(): Record<string, UnitGroupInstModel[]> {
    const guardsMap: Record<string, UnitGroupInstModel[]> = {};

    this.initialStructs.forEach(struct => {
      if (struct.struct) {
        guardsMap[struct.id] = struct.struct.generateGuard
          ? this.unitGroups.createUnitGroupFromGenModelForPlayer(
            struct.struct.generateGuard(),
            this.neutralPlayer,
          ) as UnitGroupInstModel[]
          : [];
      }

    });

    return guardsMap;
  }
}
