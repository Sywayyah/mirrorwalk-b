import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BattlegroundModule } from '../battleground/battleground.module';
import { MainScreenModule } from '../main-screen/main-screen.module';
import { MapStructuresModule } from '../map-structures/map-structures.module';
import { NewGameScreenModule } from '../new-game-screen/new-game-screen.module';
import { SandboxModeModule } from '../sandbox-mode/sandbox-mode.module';
import { SharedModule } from '../shared/shared.module';
import { TownsModule } from '../towns/towns.module';
import { MwViewControlComponent } from './components';

const components = [MwViewControlComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [
    CommonModule,
    SharedModule,
    BattlegroundModule,
    MainScreenModule,
    NewGameScreenModule,
    MapStructuresModule,
    TownsModule,
    SandboxModeModule,
  ],
})
export class ViewsModule {}
