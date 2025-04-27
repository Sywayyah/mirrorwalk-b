import { inject, Injectable } from '@angular/core';
import {
  FightNextRoundStarts,
  FightStarts,
  PlayerEquipsItem,
  PlayerEquipsItemAction,
  PlayerLosesItem,
  PlayerReceivesItem,
  PlayerUnequipsItem,
  PlayerUnequipsItemAction,
} from 'src/app/core/events';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';
import { MwItemsService } from '../mw-items.service';
import { State } from '../state.service';

@Injectable()
export class PlayerController extends StoreClient() {
  private readonly curPlayerState = inject(MwCurrentPlayerStateService);
  private readonly itemsService = inject(MwItemsService);
  private readonly state = inject(State);

  @Notify(FightNextRoundStarts)
  @Notify(FightStarts)
  public resetCooldowns(): void {
    this.curPlayerState.resetSpellsCooldowns();
  }

  @WireMethod(PlayerReceivesItem)
  public addItemToPlayer({ item, player }: PlayerEquipsItemAction): void {
    const hero = player.hero;

    hero.addItem(item);

    // if slot was unequipped, equip it with this received item.
    if (!hero.inventory.isSlotEquipped(item.baseType.slotType)) {
      this.events.dispatch(PlayerEquipsItem({ item, player }));
    }
  }

  @WireMethod(PlayerLosesItem)
  public removeItemFromPlayer({ item, player }: PlayerEquipsItemAction): void {
    const hero = player.hero;

    hero.removeItem(item);
  }

  @WireMethod(PlayerEquipsItem)
  public equipItem({ item, player }: PlayerEquipsItemAction): void {
    const hero = player.hero;

    hero.equipItem(item);

    this.itemsService.registerItemsEventHandlers(item, player);
  }

  @WireMethod(PlayerUnequipsItem)
  public unequipItem({ player, item }: PlayerUnequipsItemAction): void {
    player.hero.unequipItem(item);

    this.state.eventHandlers.items.removeAllHandlersForRef(item);
  }
}
