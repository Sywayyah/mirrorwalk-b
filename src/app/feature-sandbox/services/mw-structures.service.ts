import { Injectable } from '@angular/core';
import { ArchersOutpostStructure, BanditCamp, CalavryStalls, GraveyardStructure } from 'src/app/core/dictionaries/structures.const';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { NeutralCampStructure, StructureGeneratorModel, StructureModel, StructureTypeEnum } from "src/app/core/model/structures.types";
import { RandomUtils } from 'src/app/core/utils/common.utils';
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
    CalavryStalls,
  ];

  public structures: StructureModel[] = [
    // {
    //   type: StructureTypeEnum.NeutralCamp,
    //   id: '0',
    //   guard: this.neutralPlayer,
    //   reward: {
    //     type: NeutralRewardTypesEnum.UnitsHire,
    //     units: [
    //       { unitType: HUMANS_FRACTION_UNIT_TYPES.Pikemans, maxCount: 35 },
    //     ],
    //   } as HiringReward,
    // } as NeutralCampStructure,

    // {
    //   type: StructureTypeEnum.NeutralCamp,
    //   id: '1',
    //   guard: this.neutralPlayer,
    //   reward: {
    //     type: NeutralRewardTypesEnum.UnitsHire,
    //     units: [
    //       { unitType: HUMANS_FRACTION_UNIT_TYPES.Archers, maxCount: 24 },
    //       { unitType: HUMANS_FRACTION_UNIT_TYPES.Cavalry, maxCount: 13 },
    //     ],
    //   } as HiringReward,
    // } as NeutralCampStructure,

    // {
    //   id: '2',
    //   type: StructureTypeEnum.NeutralCamp,
    //   guard: this.neutralPlayer,
    //   reward: {
    //     type: NeutralRewardTypesEnum.Resources,
    //     resourceGroups: [
    //       [
    //         { type: ResourceType.Gold, count: 1000 },
    //         { type: ResourceType.Wood, count: 10 },
    //       ], [
    //         { type: ResourceType.RedCrystals, count: 4 },
    //       ]
    //     ],
    //   } as ResourcesReward,
    // } as NeutralCampStructure,
  ];

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
      const newStructure: NeutralCampStructure = {
        id: String(i),
        generator: structureType,
        type: StructureTypeEnum.NeutralCamp,
        reward: structureType.generateReward(),
        guard: this.neutralPlayer,
      };

      this.structures.push(newStructure);
    });
    this.guardsMap = this.generateNewGuardsMap();
  }

  public generateNewGuardsMap(): Record<string, UnitGroupInstModel[]> {
    const guardsMap: Record<string, UnitGroupInstModel[]> = {};

    this.structures.forEach(struct => {
      guardsMap[struct.id] = RandomUtils.createRandomArmyForPlayer(
        struct.generator.generateGuard(),
        this.neutralPlayer
      );
    });

    return guardsMap;
  }
}
