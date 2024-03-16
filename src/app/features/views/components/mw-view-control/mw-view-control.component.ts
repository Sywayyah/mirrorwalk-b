import { ChangeDetectorRef, Component } from '@angular/core';
import { DisplayReward, GameCommandEvents, GameOpenMainScreen, GameOpenMapStructuresScreen, NavigateToView, NeutralStructParams, OpenMainMenu, OpenNewGameScreen, PlayerEntersTown, StructCompleted, StructFightConfirmed, ViewsEnum } from 'src/app/core/events';
import { Notify, StoreClient, WireMethod } from 'src/app/store';

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

  @WireMethod(NavigateToView)
  public navigateToView({ view }: GameCommandEvents['NavigateToView']): void {
    this.currentView = view;
  }

  @Notify(GameOpenMainScreen)
  public initScreen(): void {
    this.events.dispatch(NavigateToView({ view: ViewsEnum.MainScreen }));
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

  @WireMethod(StructCompleted)
  public structIsCompleted(event: NeutralStructParams): void {
    event.struct.isInactive = true;

    this.events.dispatch(NavigateToView({ view: ViewsEnum.Structures }));

    this.events.dispatch(DisplayReward({
      struct: event.struct
    }));
  }

  @Notify(PlayerEntersTown)
  public displayTown(): void {
    this.currentView = ViewsEnum.Town;
  }
}
