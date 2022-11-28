import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PreviewPopup } from 'src/app/core/ui';
import { MwPlayersService } from 'src/app/feature-sandbox/services';
import { ApiProvider } from 'src/app/feature-sandbox/services/api-provider.service';

@Component({
  selector: 'mw-preview-popup',
  templateUrl: './preview-popup.component.html',
  styleUrls: ['./preview-popup.component.scss']
})
export class PreviewPopupComponent implements OnInit {

  @Input() public popup!: PreviewPopup;
  @Output() public close: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private players: MwPlayersService,
    private apiProvider: ApiProvider,
  ) { }

  ngOnInit(): void {
  }

  public closePopup(): void {
    this.close.emit();
  }

  public accept(): void {
    const currentPlayer = this.players.getCurrentPlayer();

    this.popup.struct.generator.onVisited?.({
      playersApi: this.apiProvider.getPlayerApi(),
      spellsApi: this.apiProvider.getSpellsApi(),
      visitingPlayer: currentPlayer,
    });

    this.popup.struct.isInactive = true;

    this.closePopup();
  }
}
