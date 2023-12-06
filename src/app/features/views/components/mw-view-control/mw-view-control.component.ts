import { ChangeDetectorRef, Component } from '@angular/core';
import { DisplayReward, GameOpenMainScreen, GameOpenMapStructuresScreen, NeutralStructParams, OpenMainMenu, OpenNewGameScreen, PlayerEntersTown, StructCompleted, StructFightConfirmed } from 'src/app/core/events';
import { Notify, StoreClient, WireMethod } from 'src/app/store';

enum ViewsEnum {
  MainScreen = 'main-screen',
  NewGame = 'new-game',

  Structures = 'structures',
  Battleground = 'battleground',
  Town = 'town',
}

@Component({
  selector: 'mw-view-control',
  templateUrl: './mw-view-control.component.html',
  styleUrls: ['./mw-view-control.component.scss'],
})
export class MwViewControlComponent extends StoreClient() {
  public currentView: ViewsEnum = ViewsEnum.MainScreen;
  public viewTypes: typeof ViewsEnum = ViewsEnum;

  constructor(private readonly cdr: ChangeDetectorRef) {
    super();
  }

  openMainMenu(): void {
    this.events.dispatch(OpenMainMenu());
  }

  @Notify(GameOpenMainScreen)
  public initScreen(): void {
    this.currentView = ViewsEnum.MainScreen;
  }

  @Notify(OpenNewGameScreen)
  public openMewGameScreen(): void {
    this.currentView = ViewsEnum.NewGame;
  }

  @Notify(GameOpenMapStructuresScreen)
  public openMapStructuresScreen(): void {
    this.currentView = ViewsEnum.Structures;
  }

  @Notify(StructFightConfirmed)
  public playerAcceptsFight(): void {
    this.currentView = ViewsEnum.Battleground;
    this.cdr.detectChanges();
  }

  @WireMethod(StructCompleted)
  public structIsCompleted(event: NeutralStructParams): void {
    event.struct.isInactive = true;
    this.currentView = ViewsEnum.Structures;

    this.events.dispatch(DisplayReward({
      struct: event.struct
    }));
  }

  @Notify(PlayerEntersTown)
  public displayTown(): void {
    this.currentView = ViewsEnum.Town;
  }
}
