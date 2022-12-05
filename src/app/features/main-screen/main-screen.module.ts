import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MainScreenComponent } from './components/main-screen/main-screen.component';


@NgModule({
  declarations: [MainScreenComponent],
  exports: [MainScreenComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
})
export class MainScreenModule { }
