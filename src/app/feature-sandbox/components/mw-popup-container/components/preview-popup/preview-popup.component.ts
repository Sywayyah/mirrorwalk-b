import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MwPlayersService, PreviewPopup } from 'src/app/feature-sandbox/services';

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
  ) { }

  ngOnInit(): void {
  }

  public closePopup(): void {
    this.close.emit();
  }

  public accept(): void {
    const currentPlayer = this.players.getCurrentPlayer();

    this.popup.struct.generator.onVisited?.({
      api: {
        addManaToPlayer: (player, mana) => {
          const heroStats = player.hero.stats;
          const newMana = heroStats.currentMana + mana;

          heroStats.currentMana = newMana > heroStats.maxMana ? heroStats.maxMana : newMana;

        },
        addMaxManaToPlayer: (player, mana) => {
          player.hero.stats.maxMana += mana;
        },
      },
      visitingPlayer: currentPlayer,
    });

    this.popup.struct.isInactive = true;

    this.closePopup();
  }
}
