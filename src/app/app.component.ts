import { Component, OnInit, ViewChild } from '@angular/core';
import { BattleController, CombatController, PlayerController, StructuresController, ItemsController, BattleLogController, UiController, GameController } from './features/services/controllers';
import { InGameApiController } from './features/services/controllers/in-game-api.service';
import { PopupsController } from './features/services/controllers/popups.service';
import { GameStart } from './features/services/events';
import { HintsService } from './features/services/hints.service';
import { HintsContainerComponent } from './features/shared/components';
import { EventsService } from './store';
import './core/scripts';

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
    PopupsController,
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
    popups: PopupsController,
    private events: EventsService,
    // players: MwPlayersService,
    // items: MwItemsService,
  ) {
    /* listener not created at this point */
    this.events.dispatch(GameStart({}));
    // items.initService(combat);
    // players.initPlayers();
    // players.addItemToPlayer(players.getCurrentPlayer(), items.createItem(ItemDoomstring));
    // players.addItemToPlayer(players.getCurrentPlayer(), items.createItem(ItemWindCrest));
  }

  public ngOnInit(): void {
    this.hintsService.containerRef = this.hintsContainer;
  }
}
