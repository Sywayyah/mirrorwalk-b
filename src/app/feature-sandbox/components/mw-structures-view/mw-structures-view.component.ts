import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel, UnitGroupInstModel } from 'src/app/core/model/main.model';
import { NeutralCampStructure, StructureModel, StructureTypeEnum } from "src/app/core/model/structures.types";
import { BattleEventsService, BattleEventTypeEnum, MwPlayersService } from '../../services';
import { MwStructuresService } from '../../services/mw-structures.service';

@Component({
  selector: 'mw-structures-view',
  templateUrl: './mw-structures-view.component.html',
  styleUrls: ['./mw-structures-view.component.scss']
})
export class MwStructuresViewComponent implements OnInit {

  public guardsMap: Record<string, UnitGroupInstModel[]>;
  public structures: StructureModel[];
  public structureTypes: typeof StructureTypeEnum = StructureTypeEnum;
  public player: PlayerInstanceModel;

  constructor(
    private readonly structuresService: MwStructuresService,
    private readonly playersService: MwPlayersService,
    private readonly events: BattleEventsService,
  ) {
    this.structures = this.structuresService.structures;
    this.guardsMap = this.structuresService.guardsMap;
    this.player = this.playersService.getCurrentPlayer();
  }

  ngOnInit(): void {
  }

  public onStructureSelected(struct: NeutralCampStructure): void {
    if (struct.isInactive) {
      return;
    }

    this.playersService.getEnemyPlayer().unitGroups = this.guardsMap[struct.id];

    this.events.dispatchEvent({ type: BattleEventTypeEnum.Struct_Selected, struct });
  }

}
