import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { InventoryItems } from 'src/app/core/items';
import { Specialties, specialtyLabels } from 'src/app/core/modifiers';
import { getEntries } from 'src/app/core/utils/common';
import { MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from 'src/app/features/shared/components';

@Component({
  selector: 'mw-hero-popup',
  templateUrl: './hero-popup.component.html',
  styleUrls: ['./hero-popup.component.scss']
})
export class HeroPopupComponent extends BasicPopup<{}> {

  public readonly currentPlayer = this.playersService.getCurrentPlayer();

  public readonly hero = this.currentPlayer.hero;

  public readonly heroStats$ = this.hero.listenHeroStats();

  public readonly itemSlots = InventoryItems.getSlotTypes();

  public readonly heroSpecialties$ = this.hero.specialtiesModGroup.onValueChanges().pipe(
    map((specialties) => getEntries(specialties)
      .filter(([, specValue]) => specValue)
      .map(([specName, specValue]) => `${specialtyLabels[specName as keyof Specialties]}: ${specValue}`)),
  );

  constructor(
    private readonly playersService: MwPlayersService,
    public readonly state: State,
  ) {
    super();
  }
}
