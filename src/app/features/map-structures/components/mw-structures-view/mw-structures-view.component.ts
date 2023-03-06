import { Component } from '@angular/core';
import { ViewStructure } from 'src/app/core/locations';
import { PlayerInstanceModel } from 'src/app/core/players';
import { NeutralCampStructure } from 'src/app/core/structures';
import { MwPlayersService, MwStructuresService } from 'src/app/features/services';
import { PlayerEntersTown, PlayerOpensHeroInfo, StructSelected } from 'src/app/features/services/events';
import { State } from 'src/app/features/services/state.service';
import { EventsService } from 'src/app/store';

/* Rewamp this a bit later, along with service and the rest */
/*  Check more cases, stuff like that */
/*  also think on positioning of svg in html */

@Component({
  selector: 'mw-structures-view',
  templateUrl: './mw-structures-view.component.html',
  styleUrls: ['./mw-structures-view.component.scss'],
})
export class MwStructuresViewComponent {
  public player: PlayerInstanceModel;

  constructor(
    private readonly playersService: MwPlayersService,
    private events: EventsService,
    public state: State,
    public readonly structsService: MwStructuresService,
  ) {
    this.player = this.playersService.getCurrentPlayer();
  }


  public handleStructure(struct: ViewStructure): void {
    if (!this.structsService.availableStructuresMap[struct.id] || !struct.structure || struct.structure?.isInactive) {
      return;
    }

    this.playersService.getEnemyPlayer().unitGroups = this.structsService.guardsMap[struct.id];

    this.events.dispatch(StructSelected({
      struct: struct.structure,
    }));
  }

  public onStructureSelected(struct: NeutralCampStructure): void {
    if (struct.isInactive) {
      return;
    }

    this.playersService.getEnemyPlayer().unitGroups = this.structsService.guardsMap[struct.id];

    this.events.dispatch(StructSelected({
      struct
    }));
  }

  public goToTown(): void {
    this.events.dispatch(PlayerEntersTown({}));
  }

  public openPlayerInfo(): void {
    this.events.dispatch(PlayerOpensHeroInfo({}));
  }
}
