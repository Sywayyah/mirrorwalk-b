import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BattlegroundModule } from './features/battleground/battleground.module';
import { SharedModule } from './features/shared/shared.module';
import { ViewsModule } from './features/views/views.module';
import { MwErrorHandler } from './error-handler';



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
      useClass: MwErrorHandler,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
