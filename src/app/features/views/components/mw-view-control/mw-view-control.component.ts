import { Component } from '@angular/core';
import {
  DisplayReward,
  GameCommandEvents,
  GameOpenMainScreen,
  GameOpenMapStructuresScreen,
  NavigateToView,
  NeutralStructParams,
  OpenMainMenu,
  OpenMultiplayer,
  OpenNewGameScreen,
  OpenSandboxMode,
  OpenScenarioMode,
  PlayerEntersTown,
  StructCompleted,
  StructFightConfirmed,
  ViewsEnum,
} from 'src/app/core/events';
import { injectCdr } from 'src/app/core/utils';
import { Notify, StoreClient, WireMethod } from 'src/app/store';

@Component({
  selector: 'mw-view-control',
  templateUrl: './mw-view-control.component.html',
  styleUrls: ['./mw-view-control.component.scss'],
  standalone: false,
})
export class MwViewControlComponent extends StoreClient() {
  private readonly cdr = injectCdr();

  readonly resourceViews = [ViewsEnum.Battleground, ViewsEnum.Structures, ViewsEnum.Town];
  currentView: ViewsEnum = ViewsEnum.MainScreen;
  readonly viewTypes: typeof ViewsEnum = ViewsEnum;

  openMainMenu(): void {
    this.events.dispatch(OpenMainMenu());
  }

  @WireMethod(NavigateToView)
  public navigateToView({ view }: GameCommandEvents['NavigateToView']): void {
    this.currentView = view;
  }

  @Notify(GameOpenMainScreen)
  public initScreen(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.MainScreen }));
  }

  @Notify(OpenMultiplayer)
  public openMultiplayer(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.Multiplayer }));
  }

  @Notify(OpenNewGameScreen)
  public openMewGameScreen(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.NewGame }));
  }

  @Notify(GameOpenMapStructuresScreen)
  public openMapStructuresScreen(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.Structures }));
  }

  @Notify(StructFightConfirmed)
  public playerAcceptsFight(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.Battleground }));
    this.cdr.detectChanges();
  }

  @Notify(OpenSandboxMode)
  public openSandboxMode(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.SandboxMode }));
    this.cdr.detectChanges();
  }

  @Notify(OpenScenarioMode)
  public openScenarioMode(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.ScenarioMode }));
    this.cdr.detectChanges();
  }

  @WireMethod(StructCompleted)
  public structIsCompleted(event: NeutralStructParams): void {
    event.struct.isInactive = true;

    this.events.dispatch(NavigateToView({ view: ViewsEnum.Structures }));

    this.events.dispatch(
      DisplayReward({
        struct: event.struct,
      }),
    );
  }

  @Notify(PlayerEntersTown)
  public displayTown(): void {
    this.currentView = ViewsEnum.Town;
  }
}
