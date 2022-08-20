import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MwPlayersService, PreviewPopup } from 'src/app/feature-sandbox/services';
import { MwHeroesService } from 'src/app/feature-sandbox/services/mw-heroes.service';
import { MwSpellsService } from 'src/app/feature-sandbox/services/mw-spells.service';

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
    private heroes: MwHeroesService,
    private spells: MwSpellsService,
  ) { }

  ngOnInit(): void {
  }

  public closePopup(): void {
    this.close.emit();
  }

  public accept(): void {
    const currentPlayer = this.players.getCurrentPlayer();

    this.popup.struct.generator.onVisited?.({
      playersApi: {
        addManaToPlayer: (player, mana) => {
          this.heroes.addManaToHero(player.hero, mana);
        },
        addMaxManaToPlayer: (player, mana) => {
          this.heroes.addMaxManaToHero(player.hero, mana);
        },
        addSpellToPlayerHero: (player, spell) => {
          this.heroes.addSpellToHero(player.hero, spell);
        },
        getCurrentPlayer: () => this.players.getCurrentPlayer(),
        getCurrentPlayerUnitGroups: () => this.players.getUnitGroupsOfPlayer(this.players.getCurrentPlayer().id),
      },
      spellsApi: {
        createSpellInstance: (spell, options) => {
          return this.spells.createSpellInstance(spell, options);
        },
      },
      visitingPlayer: currentPlayer,
    });

    this.popup.struct.isInactive = true;

    this.closePopup();
  }
}
