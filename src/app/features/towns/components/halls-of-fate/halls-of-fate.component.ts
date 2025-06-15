import { Component, inject, signal } from '@angular/core';
import { ActionCard } from 'src/app/core/action-cards';
import { BaseDialog } from 'src/app/core/dialogs';
import { ItemBaseType } from 'src/app/core/items';
import { HallsOfFateConfig } from 'src/app/core/players';
import { CostableItem, SignalCostableCountItem } from 'src/app/core/resources';
import { SpellBaseType } from 'src/app/core/spells';
import { Building } from 'src/app/core/towns';
import { MwItemsService, MwPlayersService, MwSpellsService } from 'src/app/features/services';
import { PopupService } from 'src/app/features/shared/components';
import { EventsService } from 'src/app/store';
import { LocalDialogComponent } from '../../../shared/components/local-dialog/local-dialog.component';
import { SharedModule } from '../../../shared/shared.module';
import { BuildPopupComponent } from '../build-popup/build-popup.component';
import { CommonUtils } from 'src/app/core/utils';
import { AddActionCardsToPlayer } from 'src/app/core/events';

@Component({
  selector: 'mw-halls-of-fate',
  imports: [SharedModule, LocalDialogComponent],
  templateUrl: './halls-of-fate.component.html',
  styleUrl: './halls-of-fate.component.scss',
})
export class HallsOfFateComponent extends BaseDialog<{ building: Building }> {
  private readonly playersService = inject(MwPlayersService);
  private readonly events = inject(EventsService);
  private readonly itemsService = inject(MwItemsService);
  private readonly spellsService = inject(MwSpellsService);
  private readonly popupsService = inject(PopupService);

  readonly player = this.playersService.getCurrentPlayer();
  readonly hero = this.player.hero;

  readonly actionCardToBuy = signal<null | SignalCostableCountItem<ActionCard>>(null);

  readonly itemToBuy = signal<null | ItemBaseType>(null);
  readonly spellToBuy = signal<null | CostableItem<SpellBaseType>>(null);

  readonly activeHallsOfFateConfig = signal<null | HallsOfFateConfig>(null);

  upgradeBuilding(): void {
    this.close();
    this.popupsService.createBasicPopup({
      component: BuildPopupComponent,
      data: {
        building: this.dialogData.building,
        targetLevel: 2,
      },
      class: 'dark',
    });
  }

  buyActionCard(): void {
    const actionCardToBuy = this.actionCardToBuy();
    actionCardToBuy?.count.update((count) => --count);
    this.playersService.removeResourcesFromPlayer(this.player, actionCardToBuy!.cost);

    if (!actionCardToBuy?.count()) {
      CommonUtils.removeItem(this.activeHallsOfFateConfig()!.actionCards, actionCardToBuy);
    }

    this.events.dispatch(
      AddActionCardsToPlayer({
        player: this.player,
        actionCardStacks: [{ card: actionCardToBuy!.item, count: 1 }],
      }),
    );
  }

  buyItem(): void {
    const itemToBuy = this.itemToBuy();
    this.playersService.removeResourcesFromPlayer(this.player, itemToBuy!.cost!);

    CommonUtils.removeItem(this.activeHallsOfFateConfig()!.items, itemToBuy);
    this.playersService.addItemToPlayer(
      this.playersService.getCurrentPlayer(),
      this.itemsService.createItem(itemToBuy!),
    );
  }

  buySpell(): void {
    const spellToBuy = this.spellToBuy();
    this.playersService.removeResourcesFromPlayer(this.player, spellToBuy!.cost);

    CommonUtils.removeItem(this.activeHallsOfFateConfig()!.spells, spellToBuy);
    const spellInstance = this.spellsService.createSpellInstance(spellToBuy!.item);
    this.playersService.addSpellToPlayer(this.player, spellInstance);
  }

  canPurchaseActionCard(): boolean {
    const actionCard = this.actionCardToBuy();

    if (!actionCard) {
      return false;
    }

    return this.playersService.playerHasResources(this.player, actionCard.cost);
  }

  canPurchaseItem(): boolean {
    const itemToBuy = this.itemToBuy();
    if (!itemToBuy?.cost) {
      return false;
    }
    return this.playersService.playerHasResources(this.player, itemToBuy.cost);
  }

  canPurchaseSpell(): boolean {
    const spellToBuy = this.spellToBuy();
    if (!spellToBuy) {
      return false;
    }
    return this.playersService.playerHasResources(this.player, spellToBuy.cost);
  }
}
