import { Component, OnInit, ViewChild, inject } from '@angular/core';
import './core/scripts';
import { MwTriggersService } from './features/services';
import { BattleController, BattleLogController, CombatController, GameController, ItemsController, PlayerController, StructuresController, UiController } from './features/services/controllers';
import { InGameApiController } from './features/services/controllers/in-game-api.service';
import { PopupsController } from './features/services/controllers/popups.service';
import { GameStart } from './features/services/events';
import { HintsService } from './features/services/hints.service';
import { HintsContainerComponent } from './features/shared/components';
import { EventsService } from './store';

const GlobalServices = [
  // logic controllers
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

  MwTriggersService,
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: GlobalServices,
})
export class AppComponent implements OnInit {
  @ViewChild('hintsContainer', { static: true }) public hintsContainer!: HintsContainerComponent;

  constructor(
    private readonly hintsService: HintsService,
    private events: EventsService,
  ) {
    this.injectGlobalServices();

    this.events.dispatch(GameStart());
  }

  public ngOnInit(): void {
    this.hintsService.containerRef = this.hintsContainer;
  }

  private injectGlobalServices(): void {
    GlobalServices.forEach(service => inject(service as any));
  }
}
