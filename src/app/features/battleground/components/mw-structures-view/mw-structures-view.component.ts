import { Component, OnInit } from '@angular/core';
import { PlayerInstanceModel } from 'src/app/core/players';
import { NeutralCampStructure, StructureModel, StructureTypeEnum } from 'src/app/core/structures';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { MwStructuresService, MwPlayersService } from 'src/app/features/services';
import { StructSelected } from 'src/app/features/services/events';
import { EventsService } from 'src/app/store';

@Component({
  selector: 'mw-structures-view',
  templateUrl: './mw-structures-view.component.html',
  styleUrls: ['./mw-structures-view.component.scss'],
})
export class MwStructuresViewComponent implements OnInit {

  public guardsMap: Record<string, UnitGroupInstModel[]>;
  public structures: StructureModel[];
  public structureTypes: typeof StructureTypeEnum = StructureTypeEnum;
  public player: PlayerInstanceModel;

  constructor(
    private readonly structuresService: MwStructuresService,
    private readonly playersService: MwPlayersService,
    private events: EventsService,
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

    this.events.dispatch(StructSelected({
      struct
    }));
  }

}
