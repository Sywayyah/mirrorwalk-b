import { Injectable } from '@angular/core';
import { NEUTRAL_FRACTION_UNIT_TYPES, NEUTRAL_TYPES_ENUM } from 'src/app/core/dictionaries/unit-types/neutral-unit-types.dictionary';
import { HUMANS_FRACTION_UNIT_TYPES } from 'src/app/core/dictionaries/unit-types/unit-types.dictionary';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { ResourceType } from 'src/app/core/model/resources.types';
import { HiringReward, NeutralCampStructure, NeutralRewardTypesEnum, ResourcesReward, StructureModel, StructureTypeEnum } from "src/app/core/model/structures.types";
import { RandomUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';
import { BattleEventTypeEnum } from './types';

@Injectable({
  providedIn: 'root'
})
export class MwStructuresService {

  public neutralPlayer: PlayerInstanceModel = this.playersService.getEnemyPlayer();

  public structures: StructureModel[] = [
    {
      type: StructureTypeEnum.NeutralCamp,
      id: '0',
      guard: this.neutralPlayer,
      reward: {
        type: NeutralRewardTypesEnum.UnitsHire,
        units: [
          { unitType: HUMANS_FRACTION_UNIT_TYPES.Pikemans, maxCount: 35 },
        ],
      } as HiringReward,
    } as NeutralCampStructure,

    {
      type: StructureTypeEnum.NeutralCamp,
      id: '1',
      guard: this.neutralPlayer,
      reward: {
        type: NeutralRewardTypesEnum.UnitsHire,
        units: [
          { unitType: HUMANS_FRACTION_UNIT_TYPES.Archers, maxCount: 24 },
          { unitType: HUMANS_FRACTION_UNIT_TYPES.Cavalry, maxCount: 13 },
        ],
      } as HiringReward,
    } as NeutralCampStructure,

    {
      id: '2',
      type: StructureTypeEnum.NeutralCamp,
      guard: this.neutralPlayer,
      reward: {
        type: NeutralRewardTypesEnum.Resources,
        resourceGroups: [
          [
            { type: ResourceType.Gold, count: 1000 },
            { type: ResourceType.Wood, count: 10 },
          ], [
            { type: ResourceType.RedCrystals, count: 4 },
          ]
        ],
      } as ResourcesReward,
    } as NeutralCampStructure,
  ];

  public guardsMap: Record<string, UnitGroupInstModel[]> = this.generateNewGuardsMap();

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
  }

  public generateNewGuardsMap(): Record<string, UnitGroupInstModel[]> {
    const guardsMap: Record<string, UnitGroupInstModel[]> = {};

    this.structures.forEach(struct => {
      guardsMap[struct.id] = RandomUtils.createRandomArmyForPlayer(
        {
          fraction: NEUTRAL_FRACTION_UNIT_TYPES,
          maxUnitGroups: 5,
          minUnitGroups: 2,
          units: [
            [NEUTRAL_TYPES_ENUM.Gnolls, 10, 40, 3],
            [NEUTRAL_TYPES_ENUM.ForestTrolls, 10, 25, 2],
            [NEUTRAL_TYPES_ENUM.Thiefs, 12, 37, 2],
            [NEUTRAL_TYPES_ENUM.Ghosts, 24, 42, 3],
          ],
        },
        this.neutralPlayer
      );
    });

    return guardsMap;
  }
}
