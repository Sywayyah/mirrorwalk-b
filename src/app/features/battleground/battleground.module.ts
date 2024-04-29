import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MwBattleHeroAbilitiesComponent, MwGameboardComponent, MwHistoryLogComponent, MwItemsPanelComponent, MwPlayerResourcesComponent, MwSpellButtonComponent, MwUnitGroupCardComponent, UnitGroupBuffComponent, UnitGroupSpellComponent } from './components';
import { HeroPopupComponent } from './components/hero-popup/hero-popup.component';

const components = [
  MwBattleHeroAbilitiesComponent,
  MwGameboardComponent,
  MwHistoryLogComponent,
  MwItemsPanelComponent,
  MwPlayerResourcesComponent,
  HeroPopupComponent,
  MwSpellButtonComponent,
  MwUnitGroupCardComponent,
  UnitGroupBuffComponent,
  UnitGroupSpellComponent,
];

@NgModule({
  declarations: components,
  exports: components,
  imports: [SharedModule, CommonModule],
})
export class BattlegroundModule { }
