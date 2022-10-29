import { Injectable } from '@angular/core';
import { ArchersOutpostStructure, BanditCamp, BeaconOfTheUndead, CalavryStalls, GraveyardStructure, MagicRiverStructure } from 'src/app/core/dictionaries/structures';
import { BigCampStructure as BigCampStrcuture } from 'src/app/core/dictionaries/structures/big-camp.struct';
import { MountainNestStructure } from 'src/app/core/dictionaries/structures/mountain-nest.struct';
import { WitchHutStructure } from 'src/app/core/dictionaries/structures/witch-hut.struct';
import { NeutralCampStructure, NeutralSite, PlayerInstanceModel, StructureGeneratorModel, StructureModel, StructureTypeEnum, UnitGroupInstModel } from 'src/app/core/model';
import { MwPlayersService, MwUnitGroupsService } from './';

@Injectable({
  providedIn: 'root'
})
export class MwStructuresService {

  /*
   todo: revisit this complicated structures logic, introduce maps/locations
  */
  public neutralPlayer: PlayerInstanceModel = this.playersService.getEnemyPlayer();

  public structureTypes: StructureGeneratorModel[] = [
    BeaconOfTheUndead,
    GraveyardStructure,

    ArchersOutpostStructure,
    BanditCamp,
    BanditCamp,
    CalavryStalls,
    WitchHutStructure,
    MagicRiverStructure,
    MountainNestStructure,
    BigCampStrcuture,
  ];

  public structures: StructureModel[] = [];

  public guardsMap: Record<string, UnitGroupInstModel[]>;

  public currentStruct!: StructureModel;

  constructor(
    private playersService: MwPlayersService,
    // private events: BattleEventsService,
    private unitGroups: MwUnitGroupsService,
  ) {
    // this.events.onEvents({
    //   [BattleEvent.Struct_Selected]: event => {
    //     this.currentStruct = event.struct;
    //   },
    // }).subscribe();

    this.generateStructuresByTypes();
    this.guardsMap = this.generateNewGuardsMap();
  }

  private generateStructuresByTypes(): void {
    /* Improve this logic */
    this.structureTypes.forEach((structureType, i) => {

      if (structureType.generateGuard && structureType.generateReward) {
        const newStructure: NeutralCampStructure = {
          id: String(i),
          generator: structureType,
          type: StructureTypeEnum.NeutralCamp,
          reward: structureType.generateReward(),
          guard: this.neutralPlayer,
        };

        this.structures.push(newStructure);
        return;
      }

      if (!structureType.generateGuard && structureType.generateReward) {
        const newStructure: NeutralSite = {
          id: String(i),
          generator: structureType,
          type: StructureTypeEnum.NeutralSite,
          reward: structureType.generateReward(),
        };

        this.structures.push(newStructure);
        return;
      }

      if (structureType.onVisited) {
        const neutralSiteStructure: NeutralSite = {
          generator: structureType,
          id: String(i),
          type: StructureTypeEnum.NeutralSite,
        };

        this.structures.push(neutralSiteStructure);
        return;
      }

    });
  }

  private generateNewGuardsMap(): Record<string, UnitGroupInstModel[]> {
    const guardsMap: Record<string, UnitGroupInstModel[]> = {};

    this.structures.forEach(struct => {
      guardsMap[struct.id] = struct.generator.generateGuard
        ? this.unitGroups.createUnitGroupFromGenModelForPlayer(
          struct.generator.generateGuard(),
          this.neutralPlayer,
        ) as UnitGroupInstModel[]
        : [];
    });

    return guardsMap;
  }

}
