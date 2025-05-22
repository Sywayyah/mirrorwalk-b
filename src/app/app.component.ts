import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { RaidersActionCard, RainbowActionCard, SnowfallActionCard, ThunderActionCard } from './core/action-cards/event-actions';
import { AttackActionCard, InitiativeAttackCard, VisitActionCard } from './core/action-cards/location-actions';
import { MeditateActionCard, SkipDayActionCard } from './core/action-cards/player-actions';
import { GameStarted } from './core/events';
import './core/scripts';
import { MwTriggersService } from './features/services';
import { BattleController, BattleLogController, CombatController, GameController, ItemsController, PlayerController, StructuresController, UiController } from './features/services/controllers';
import { InGameApiController } from './features/services/controllers/in-game-api.service';
import { PopupsController } from './features/services/controllers/popups.service';
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
  standalone: false
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('hintsContainer', { static: true }) public hintsContainer!: HintsContainerComponent;

  actionCards = [
    AttackActionCard,
    InitiativeAttackCard,
    VisitActionCard,

    RaidersActionCard,
    RainbowActionCard,
    SkipDayActionCard,

    ThunderActionCard,
    MeditateActionCard,
    SnowfallActionCard,

  ];

  constructor(
    private readonly hintsService: HintsService,
    private events: EventsService,
  ) {
    this.injectGlobalServices();
  }

  public ngOnInit(): void {
    this.hintsService.containerRef = this.hintsContainer;
  }

  public ngAfterViewInit(): void {
    this.events.dispatch(GameStarted());
  }

  private injectGlobalServices(): void {
    GlobalServices.forEach(service => inject(service as any));
  }
}
