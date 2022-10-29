import { Component, OnInit, ViewChild } from '@angular/core';
import { HintsContainerComponent } from './feature-sandbox/components/ui-elements/hints-container/hints-container.component';
import { CombatInteractorService } from './feature-sandbox/services';
import { BattleController, BattleLogController, CombatController, GameController, ItemsController, PlayerController, StructuresController, UiController } from './feature-sandbox/services/controllers';
import { MwItemsService } from './feature-sandbox/services/mw-items.service';
import { HintsService } from './feature-sandbox/services/ui/hints.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    BattleController,
    CombatController,
    PlayerController,
    StructuresController,
    ItemsController,
    BattleLogController,
    UiController,
    GameController,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('hintsContainer', { static: true }) public hintsContainer!: HintsContainerComponent;

  constructor(
    private readonly hintsService: HintsService,
    private readonly combat: CombatInteractorService,
    battleController: BattleController,
    combatController: CombatController,
    playerController: PlayerController,
    battleLogController: BattleLogController,
    itemsController: ItemsController,
    structureController: StructuresController,
    uiController: UiController,
    gameController: GameController,
    // players: MwPlayersService,
    items: MwItemsService,
  ) {
    items.initService(combat);
    // players.initPlayers();
    // players.addItemToPlayer(players.getCurrentPlayer(), items.createItem(ItemDoomstring));
    // players.addItemToPlayer(players.getCurrentPlayer(), items.createItem(ItemWindCrest));
  }

  public ngOnInit(): void {
    this.hintsService.containerRef = this.hintsContainer;
  }
}
