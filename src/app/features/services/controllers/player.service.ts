import { Injectable } from '@angular/core';
import { FightNextRoundStarts, FightStarts, PlayerEquipsItem, PlayerEquipsItemAction, PlayerReceivesItem, PlayerUnequipsItem, PlayerUnequipsItemAction } from 'src/app/core/events';
import { CommonUtils } from 'src/app/core/unit-types';
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

    hero.items.push(item);

    // if slot was unequipped, equip it with this received item.
    if (!hero.inventory.isSlotEquipped(item.baseType.slotType)) {
      this.events.dispatch(PlayerEquipsItem({ item, player }));
    }
  }

  @WireMethod(PlayerEquipsItem)
  public equipItem({ item, player }: PlayerEquipsItemAction): void {
    const hero = player.hero;

    hero.inventory.equipItem(item);

    hero.mods.push(item.baseType.staticMods);

    const itemBase = item.baseType;

    if (itemBase.staticMods.playerBonusAttack) {
      /* todo: rethink this. modifiers array can be better */
      hero.stats.bonusAttack += itemBase.staticMods.playerBonusAttack;
    }

    if (itemBase.staticMods.playerBonusDefence) {
      hero.stats.bonusDefence += itemBase.staticMods.playerBonusDefence;
    }

    if (itemBase.bonusAbilities) {
      itemBase.bonusAbilities.forEach((spellConfig) => {
        const spellInstance = this.spellsService.createSpellInstance(
          spellConfig.spell,
          { initialLevel: spellConfig.level },
        );

        spellInstance.sourceInfo.item = item;

        hero.spells.push(spellInstance);
      });
    }

    this.itemsService.registerItemsEventHandlers(item, player);
  }

  @WireMethod(PlayerUnequipsItem)
  public unequipItem({ player, item }: PlayerUnequipsItemAction): void {
    CommonUtils.removeItem(player.hero.mods, item.baseType.staticMods);

    player.hero.inventory.unequipSlot(item.baseType.slotType);

    if (item.baseType.staticMods.playerBonusAttack) {
      player.hero.stats.bonusAttack -= item.baseType.staticMods.playerBonusAttack;
    }

    if (item.baseType.staticMods.playerBonusDefence) {
      player.hero.stats.bonusDefence -= item.baseType.staticMods.playerBonusDefence;
    }

    player.hero.spells = player.hero.spells.filter(spell => spell.sourceInfo.item !== item);
    this.state.eventHandlers.items.removeAllHandlersForRef(item);
  }
}
