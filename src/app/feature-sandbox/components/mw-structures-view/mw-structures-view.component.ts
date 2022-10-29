import { Component, OnInit } from '@angular/core';
import { NeutralCampStructure, PlayerInstanceModel, StructureModel, StructureTypeEnum, UnitGroupInstModel } from 'src/app/core/model';
import { MwPlayersService, MwStructuresService } from '../../services';
import { StructSelected } from '../../services/events';
import { EventsService } from '../../services/state';

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
