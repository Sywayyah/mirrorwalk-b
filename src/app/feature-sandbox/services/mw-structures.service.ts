import { Injectable } from '@angular/core';
import { ArchersOutpostStructure, BanditCamp, CalavryStalls, GraveyardStructure, MagicRiverStructure } from 'src/app/core/dictionaries/structures';
import { createHireStructure } from 'src/app/core/dictionaries/structures/utils';
import { WitchHutStructure } from 'src/app/core/dictionaries/structures/witch-hut.struct';
import { NEUTRAL_FRACTION_UNIT_TYPES, NEUTRAL_TYPES_ENUM } from 'src/app/core/dictionaries/unit-types/neutral-unit-types.dictionary';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { NeutralCampStructure, NeutralSite, StructureGeneratorModel, StructureModel, StructureTypeEnum } from "src/app/core/model/structures.types";
import { BattleEventsService } from './mw-battle-events.service';
import { MwPlayersService } from './mw-players.service';
import { MwUnitGroupsService } from './mw-unit-groups.service';
import { BattleEvent } from './types';

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
    WitchHutStructure,
    MagicRiverStructure,
    createHireStructure('Boss Camp', {
      fraction: NEUTRAL_FRACTION_UNIT_TYPES,
      maxUnitGroups: 3,
      minUnitGroups: 3,
      units: [
        [NEUTRAL_TYPES_ENUM.ForestTrolls, 24, 26, 1],
        [NEUTRAL_TYPES_ENUM.Gnolls, 28, 36, 1],
        [NEUTRAL_TYPES_ENUM.Thiefs, 15, 18, 1],
      ],
    }, []),
  ];

  public structures: StructureModel[] = [];

  public guardsMap: Record<string, UnitGroupInstModel[]>;

  public currentStruct!: StructureModel;

  constructor(
    private playersService: MwPlayersService,
    private events: BattleEventsService,
    private unitGroups: MwUnitGroupsService,
  ) {
    this.events.onEvents({
      [BattleEvent.Struct_Selected]: event => {
        this.currentStruct = event.struct;
      },
    }).subscribe();

    this.generateStructuresByTypes();
    this.guardsMap = this.generateNewGuardsMap();
  }

  private generateStructuresByTypes(): void {
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
