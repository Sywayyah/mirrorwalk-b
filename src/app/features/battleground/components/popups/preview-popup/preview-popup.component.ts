import { Component, OnInit } from '@angular/core';
import { PreviewPopup } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/features/services';
import { ApiProvider } from 'src/app/features/services/api-provider.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.scss']
})
export class PreviewPopupComponent extends BasicPopup<PreviewPopup> implements OnInit {

  constructor(
    private players: MwPlayersService,
    private apiProvider: ApiProvider,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  public closePopup(): void {
    this.close();
  }

  public accept(): void {
    const currentPlayer = this.players.getCurrentPlayer();

    const struct = this.data.struct;

    struct.generator.onVisited?.({
      playersApi: this.apiProvider.getPlayerApi(),
      spellsApi: this.apiProvider.getSpellsApi(),
      visitingPlayer: currentPlayer,
    });

    struct.isInactive = true;

    this.closePopup();
  }
}
