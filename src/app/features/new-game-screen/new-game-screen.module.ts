import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewGameScreenComponent } from './components/new-game-screen/new-game-screen.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    NewGameScreenComponent
  ],
  exports: [
    NewGameScreenComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class NewGameScreenModule { }
