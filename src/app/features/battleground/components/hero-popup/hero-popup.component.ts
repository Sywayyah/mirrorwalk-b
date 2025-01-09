import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { OpenSplitUnitGroupPopup, OpenUnitSlotsActionPopup } from 'src/app/core/events';
import { UnitGroupSlot, swapUnitsInSlots } from 'src/app/core/heroes';
import { InventoryItems } from 'src/app/core/items';
import { Specialties, specialtyLabels } from 'src/app/core/modifiers';
import { getEntries } from 'src/app/core/utils/common';
import { MwCurrentPlayerStateService, MwPlayersService } from 'src/app/features/services';
import { State } from 'src/app/features/services/state.service';
import { BasicPopup } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';

@Component({
    selector: 'mw-hero-popup',
    templateUrl: './hero-popup.component.html',
    styleUrls: ['./hero-popup.component.scss'],
    standalone: false
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

  public activeGroupSlot?: UnitGroupSlot;

  constructor(
    private readonly playersService: MwPlayersService,
    public readonly state: State,
    public readonly curPlayerState: MwCurrentPlayerStateService,
    private readonly events: EventsService,
  ) {
    super();
  }

  splitGroup(slot: UnitGroupSlot): void {
    this.activeGroupSlot = undefined;

    if (!slot.unitGroup || slot.unitGroup.count === 1) {
      return;
    }

    if (!this.hero.hasFreeUnitSlots()) {
      return;
    }

    this.events.dispatch(OpenSplitUnitGroupPopup({ unitGroup: slot.unitGroup }));
  }

  clickOnSlot(slot: UnitGroupSlot): void {
    if (!this.activeGroupSlot) {
      if (slot.unitGroup) {
        this.activeGroupSlot = slot;
      }
      return;
    }

    if (this.activeGroupSlot) {
      if (this.activeGroupSlot === slot) {
        this.activeGroupSlot = undefined;
        return;
      }

      if (slot.unitGroup) {
        if (slot.unitGroup.type === this.activeGroupSlot.unitGroup?.type) {
          this.events.dispatch(OpenUnitSlotsActionPopup({
            sourceSlot: this.activeGroupSlot,
            targetSlot: slot,
            postAction: () => {
              this.activeGroupSlot = undefined;
              this.hero.refreshUnitGroupsOrderBySlots();
            },
          }));

          return;
        }
        swapUnitsInSlots(this.activeGroupSlot, slot);
        this.activeGroupSlot = undefined;
      } else {
        // add as a field to hero that is updated on changes
        const filledMainSlotsCount = this.hero.mainUnitSlots.filter(slot => slot.unitGroup).length;

        if (!this.activeGroupSlot.isReserve && slot.isReserve && filledMainSlotsCount === 1) {
          this.activeGroupSlot = undefined;
          return;
        }

        slot.unitGroup = this.activeGroupSlot.unitGroup;
        this.activeGroupSlot.unitGroup = null;
        this.activeGroupSlot = undefined;
      }

      this.hero.refreshUnitGroupsOrderBySlots();
    }

  }
}
