import { ErrorHandler, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BattlegroundModule } from './features/battleground/battleground.module';
import { UiEventFeedService } from './features/services/ui-event-feed.service';
import { SharedModule } from './features/shared/shared.module';
import { ViewsModule } from './features/views/views.module';

class Handler extends ErrorHandler {
  private readonly feed = inject(UiEventFeedService);

  handleError(error: any): void {
    console.error(error);

    if (error.message.startsWith('NG')) {
      return;
    }

    this.feed.pushSystemError(error);
  }
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BattlegroundModule,
    ViewsModule,
    SharedModule,
    BrowserModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: Handler,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
