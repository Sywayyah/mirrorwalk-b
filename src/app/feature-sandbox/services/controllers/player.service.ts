import { Injectable } from '@angular/core';
import { CommonUtils } from 'src/app/core/unit-types';
import { FightNextRoundStarts, FightStarts, PlayerEquipsItem, PlayerEquipsItemAction, PlayerUnequipsItem, PlayerUnequipsItemAction } from '../events';
import { MwCurrentPlayerStateService } from '../mw-current-player-state.service';
import { MwItemsService } from '../mw-items.service';
import { MwSpellsService } from '../mw-spells.service';
import { Notify, StoreClient, WireMethod } from '../store';

@Injectable()
export class PlayerController extends StoreClient() {

  constructor(
    private curPlayerState: MwCurrentPlayerStateService,
    private itemsService: MwItemsService,
    private spellsService: MwSpellsService,
  ) {
    super();
  }

  @Notify(FightNextRoundStarts)
  @Notify(FightStarts)
  public resetCooldowns(): void {
    this.curPlayerState.resetSpellsCooldowns();
  }

  @WireMethod(PlayerEquipsItem)
  public equipItem({ item, player }: PlayerEquipsItemAction): void {
    player.hero.items.push(item);
    player.hero.mods.push(item.baseType.staticMods);

    if (item.baseType.staticMods.playerBonusAttack) {
      /* todo: rethink this. modifiers array can be better */
      player.hero.stats.bonusAttack += item.baseType.staticMods.playerBonusAttack;
    }

    if (item.baseType.bonusAbilities) {
      item.baseType.bonusAbilities.forEach((spellConfig) => {
        const spellInstance = this.spellsService.createSpellInstance(
          spellConfig.spell,
          { initialLevel: spellConfig.level },
        );

        spellInstance.sourceInfo.item = item;

        player.hero.spells.push(spellInstance);
      });
    }

    this.itemsService.registerItemsEventHandlers(item, player);
  }

  @WireMethod(PlayerUnequipsItem)
  public unequipItem({ player, item }: PlayerUnequipsItemAction): void {
    CommonUtils.removeItem(player.hero.items, item);
    CommonUtils.removeItem(player.hero.mods, item.baseType.staticMods);

    if (item.baseType.staticMods.playerBonusAttack) {
      player.hero.stats.bonusAttack -= item.baseType.staticMods.playerBonusAttack;
    }

    player.hero.spells = player.hero.spells.filter(spell => spell.sourceInfo.item !== item);
  }
}
