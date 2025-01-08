import { Component } from '@angular/core';
import { RemoveActionPoints } from 'src/app/core/events';
import { StructEvents } from 'src/app/core/structures/events';
import { StructPopupData } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
    selector: 'mw-preview-popup',
    templateUrl: './preview-popup.component.html',
    styleUrls: ['./preview-popup.component.scss'],
    standalone: false
})
export class PreviewPopupComponent extends BasicPopup<StructPopupData> {
  struct = this.data.struct;
  constructor(
    private players: MwPlayersService,
    private apiProvider: ApiProvider,
    private state: State,
    private events: EventsService,
  ) {
    super();
    this.state.eventHandlers.structures.triggerRefEventHandlers(this.struct, StructEvents.StructInspected());
  }

  public closePopup(): void {
    this.close();
  }

  public accept(): void {
    const currentPlayer = this.players.getCurrentPlayer();

    const struct = this.data.struct;

    struct.generator?.onVisited?.({
      playersApi: this.apiProvider.getPlayerApi(),
      spellsApi: this.apiProvider.getSpellsApi(),
      visitingPlayer: currentPlayer,
    });

    this.state.eventHandlers.structures.triggerRefEventHandlers(
      this.data.struct,
      StructEvents.StructVisited({ visitingPlayer: this.players.getCurrentPlayer() }),
    );

    const locActionPoints = this.data.struct.actionPoints;

    if (locActionPoints) {
      this.events.dispatch(RemoveActionPoints({ points: locActionPoints }));
    }

    struct.isInactive = true;

    this.closePopup();
  }
}
