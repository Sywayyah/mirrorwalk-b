import { Injectable } from '@angular/core';
import { FightNextRoundStarts, FightStarts, PlayerEquipsItem, PlayerEquipsItemAction, PlayerReceivesItem, PlayerUnequipsItem, PlayerUnequipsItemAction } from 'src/app/core/events';
import { CommonUtils } from 'src/app/core/utils';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';
import { MwItemsService } from '../mw-items.service';
import { MwSpellsService } from '../mw-spells.service';
import { State } from '../state.service';

@Injectable()
export class PlayerController extends StoreClient() {

  constructor(
    private curPlayerState: MwCurrentPlayerStateService,
    private itemsService: MwItemsService,
    private spellsService: MwSpellsService,
    private state: State,
  ) {
    super();
  }

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

  @WireMethod(PlayerEquipsItem)
  public equipItem({ item, player }: PlayerEquipsItemAction): void {
    const hero = player.hero;

    hero.equipItem(item);

    // hero.inventory.equipItem(item);

    // hero.mods.push(item.baseType.staticMods);

    const itemBase = item.baseType;

    // rework it:
    // if (itemBase.staticMods.playerBonusAttack) {
    //   /* todo: rethink this. modifiers array can be better */
    //   hero.stats.bonusAttack += itemBase.staticMods.playerBonusAttack;
    // }

    // if (itemBase.staticMods.playerBonusDefence) {
    //   hero.stats.bonusDefence += itemBase.staticMods.playerBonusDefence;
    // }

    this.itemsService.registerItemsEventHandlers(item, player);
  }

  @WireMethod(PlayerUnequipsItem)
  public unequipItem({ player, item }: PlayerUnequipsItemAction): void {
    // CommonUtils.removeItem(player.hero.mods, item.baseType.staticMods);

    // should it actually be by slot?
    // player.hero.inventory.unequipSlot(item.baseType.slotType);
    player.hero.unequipItem(item);

    // rework this
    // if (item.baseType.staticMods.playerBonusAttack) {
    //   player.hero.stats.bonusAttack -= item.baseType.staticMods.playerBonusAttack;
    // }

    // if (item.baseType.staticMods.playerBonusDefence) {
    //   player.hero.stats.bonusDefence -= item.baseType.staticMods.playerBonusDefence;
    // }

    this.state.eventHandlers.items.removeAllHandlersForRef(item);
  }
}
