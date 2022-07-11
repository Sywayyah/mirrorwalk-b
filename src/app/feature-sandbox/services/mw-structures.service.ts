import { Injectable } from '@angular/core';
import { ArchersOutpostStructure, BanditCamp, CalavryStalls, GraveyardStructure, MagicRiverStructure } from 'src/app/core/dictionaries/structures';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { NeutralCampStructure, NeutralSite, StructureGeneratorModel, StructureModel, StructureTypeEnum } from "src/app/core/model/structures.types";
import { GenerationUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';
import { BattleEventTypeEnum } from './types';

@Injectable({
  providedIn: 'root'
})
export class MwStructuresService {

  /*
   todo: revisit this complicated structures logic, introduce maps/locations
  */
  public neutralPlayer: PlayerInstanceModel = this.playersService.getEnemyPlayer();

  public structureTypes: StructureGeneratorModel[] = [
    GraveyardStructure,
    ArchersOutpostStructure,
    BanditCamp,
    BanditCamp,
    CalavryStalls,
    MagicRiverStructure,
  ];

  public structures: StructureModel[] = [];

  public guardsMap: Record<string, UnitGroupInstModel[]>;

  public currentStruct!: StructureModel;

  constructor(
    private playersService: MwPlayersService,
    private events: BattleEventsService,
  ) {
    this.events.onEvents({
      [BattleEventTypeEnum.Struct_Selected]: event => {
        this.currentStruct = event.struct;
      },
    }).subscribe();

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
      }

      if (structureType.onVisited) {
        const neutralSiteStructure: NeutralSite = {
          generator: structureType,
          id: String(i),
          type: StructureTypeEnum.NeutralSite,
        };

        this.structures.push(neutralSiteStructure);
      }

    });
    this.guardsMap = this.generateNewGuardsMap();
  }

  public generateNewGuardsMap(): Record<string, UnitGroupInstModel[]> {
    const guardsMap: Record<string, UnitGroupInstModel[]> = {};

    this.structures.forEach(struct => {
      guardsMap[struct.id] = struct.generator.generateGuard
        ? GenerationUtils.createRandomArmyForPlayer(
          struct.generator.generateGuard(),
          this.neutralPlayer
        )
        : [];
    });

    return guardsMap;
  }
}
