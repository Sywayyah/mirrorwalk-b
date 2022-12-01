import { Component, OnInit, ViewChild } from '@angular/core';
import { BattleController, CombatController, PlayerController, StructuresController, ItemsController, BattleLogController, UiController, GameController } from './features/services/controllers';
import { InGameApiController } from './features/services/controllers/in-game-api.service';
import { HintsService } from './features/services/hints.service';
import { HintsContainerComponent } from './features/shared/components';

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
    InGameApiController,
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('hintsContainer', { static: true }) public hintsContainer!: HintsContainerComponent;

  constructor(
    private readonly hintsService: HintsService,
    battleController: BattleController,
    combatController: CombatController,
    playerController: PlayerController,
    battleLogController: BattleLogController,
    itemsController: ItemsController,
    structureController: StructuresController,
    uiController: UiController,
    gameController: GameController,
    inGameApiController: InGameApiController,
    // players: MwPlayersService,
    // items: MwItemsService,
  ) {
    // items.initService(combat);
    // players.initPlayers();
    // players.addItemToPlayer(players.getCurrentPlayer(), items.createItem(ItemDoomstring));
    // players.addItemToPlayer(players.getCurrentPlayer(), items.createItem(ItemWindCrest));
  }

  public ngOnInit(): void {
    this.hintsService.containerRef = this.hintsContainer;
  }
}
