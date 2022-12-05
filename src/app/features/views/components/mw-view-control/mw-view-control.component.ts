import { Component } from '@angular/core';
import { DisplayReward, GameCreated, GameStart, NeutralStructParams, NewGameCreation, StructCompleted, StructFightConfirmed } from 'src/app/features/services/events';
import { Notify, StoreClient, WireMethod } from 'src/app/store';

enum ViewsEnum {
  MainScreen = 'main-screen',
  NewGame = 'new-game',

  Structures = 'structures',
  Battleground = 'battleground',
}

@Component({
  selector: 'mw-view-control',
  templateUrl: './mw-view-control.component.html',
  styleUrls: ['./mw-view-control.component.scss'],
})
export class MwViewControlComponent extends StoreClient() {
  public currentView: ViewsEnum = ViewsEnum.MainScreen;
  public viewTypes: typeof ViewsEnum = ViewsEnum;

  @Notify(GameStart)
  public initScreen(): void {
    this.currentView = ViewsEnum.MainScreen;
  }

  @Notify(NewGameCreation)
  public newGameScreen(): void {
    this.currentView = ViewsEnum.NewGame;
  }

  @Notify(GameCreated)
  public newGameCreated(): void {
    this.currentView = ViewsEnum.Structures;
  }

  @Notify(StructFightConfirmed)
  public playerAcceptsFight(): void {
    this.currentView = ViewsEnum.Battleground;
  }

  @WireMethod(StructCompleted)
  public structIsCompleted(event: NeutralStructParams): void {
    event.struct.isInactive = true;
    this.currentView = ViewsEnum.Structures;

    this.events.dispatch(DisplayReward({
      struct: event.struct
    }));
  }
}
