import { Injectable } from '@angular/core';
import { CombatActionsRef, SpellCreationOptions } from 'src/app/core/api/combat-api';
import { EffectType, VfxElemEffect } from 'src/app/core/api/vfx-api';
import { GameEventsHandlers } from 'src/app/core/items';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellEventHandlers, SpellInstance, SpellModel } from 'src/app/core/spells';
import { CommonUtils, UnitBase, UnitGroupInstModel } from 'src/app/core/unit-types';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { VfxService } from '../../shared/components';
import { GroupModifiersChanged, GroupSpeedChanged, InitItem, InitItemAction, InitSpell, InitSpellAction, PlayerReceivesItem, PlayersInitialized, UnitHealed, UnitSummoned } from '../events';
import { MwBattleLogService } from '../mw-battle-log.service';
import { BattleStateService } from '../mw-battle-state.service';
import { CombatInteractorService } from '../mw-combat-interactor.service';
import { MwItemsService } from '../mw-items.service';
import { MwPlayersService } from '../mw-players.service';
import { MwSpellsService } from '../mw-spells.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';

@Injectable()
export class InGameApiController extends StoreClient() {
  constructor(
    private combatInteractor: CombatInteractorService,
    private vfxService: VfxService,
    private battleState: BattleStateService,
    private spellsService: MwSpellsService,
    private units: MwUnitGroupsService,
    private battleLog: MwBattleLogService,
    private players: MwPlayersService,
    private itemsService: MwItemsService,
  ) {
    super();
  }

  @Notify(PlayersInitialized)
  public initPlayerItems(): void {
    const player = this.players.getCurrentPlayer();

    player.hero.base.initialState.items.forEach(item => {
      this.events.dispatch(PlayerReceivesItem({ player, item: this.itemsService.createItem(item) }));
    });
  }

  @WireMethod(InitSpell)
  public initSpell({ spell, player, ownerUnit }: InitSpellAction): void {
    spell.baseType.type.spellConfig.init({
      actions: this.createActionsApiRef(),
      events: {
        on: (handlers: SpellEventHandlers) => {
          const spellHandlers = this.combatInteractor.spellsHandlersMap.get(spell) ?? {};

          this.combatInteractor.spellsHandlersMap.set(spell, { ...spellHandlers, ...handlers });
        },
      },
      vfx: {
        createEffectForUnitGroup: (target, effect, options) => {
          this.vfxService.createVfxForUnitGroup(target, {
            type: EffectType.VfxElement,
            animation: effect,
          } as VfxElemEffect, options);
        },
        createFloatingMessageForUnitGroup: (target, data, options) => {
          this.vfxService.createFloatingMessageForUnitGroup(target, data, options);
        }
      },
      thisSpell: spell.baseType,
      ownerPlayer: player,
      spellInstance: spell,
      ownerHero: player.hero,
      ownerUnit: ownerUnit,
    })
  }

  @WireMethod(InitItem)
  public initItem({ item, ownerPlayer }: InitItemAction): void {
    item.baseType.config.init({
      actions: this.createActionsApiRef(),
      events: {
        on: (newEventHandlers: GameEventsHandlers) => {
          const prevEventHandlers = this.itemsService.itemsHandlersMap.get(item) ?? {};

          this.itemsService.itemsHandlersMap.set(item, { ...prevEventHandlers, ...newEventHandlers });
        }
      },
      ownerHero: ownerPlayer.hero,
      ownerPlayer: ownerPlayer,
      thisInstance: item,
    });
  }

  private createActionsApiRef(): CombatActionsRef {
    return {
      summonUnitsForPlayer: (ownerPlayer: PlayerInstanceModel, unitType: UnitBase, unitNumber: number) => {
        const summonedUnitGroup = this.battleState.summonUnitForPlayer(ownerPlayer, unitType, unitNumber);
        this.events.dispatch(UnitSummoned({ unitGroup: summonedUnitGroup }));
        return summonedUnitGroup;
      },
      dealDamageTo: (target, damage, damageType, postActionFn) => {
        this.combatInteractor.dealDamageTo(target, damage, damageType, postActionFn);
      },
      createSpellInstance: <T>(spell: SpellModel<T>, options?: SpellCreationOptions<T>) => {
        return this.spellsService.createSpellInstance(spell, options);
      },
      addModifiersToUnitGroup: (target, modifiers) => {

        const groupModifiers = this.combatInteractor.unitGroupModifiersMap.get(target);

        this.units.addModifierToUnitGroup(target, modifiers);

        if (groupModifiers) {
          groupModifiers.push(modifiers);
        } else {
          this.combatInteractor.unitGroupModifiersMap.set(target, [modifiers]);
        }

        if (modifiers.unitGroupSpeedBonus) {
          this.events.dispatch(GroupSpeedChanged({
            unitGroup: target
          }));
        }

        this.events.dispatch(GroupModifiersChanged({
          unitGroup: target,
        }));
      },
      createModifiers: (modifiers) => {
        return this.spellsService.createModifiers(modifiers);
      },
      removeModifiresFromUnitGroup: (target, modifiers) => {
        /* todo: solve mods/spells being duplicated in 2 places. */
        const unitGroupMods = this.combatInteractor.unitGroupModifiersMap.get(target);

        this.units.removeModifiers(target, modifiers);

        if (unitGroupMods) {
          CommonUtils.removeItem(unitGroupMods, modifiers);
        }

        this.events.dispatch(GroupModifiersChanged({
          unitGroup: target,
        }));
      },
      /* dark magic of types, just so it can work */
      addSpellToUnitGroup: <T>(target: UnitGroupInstModel, spell: SpellInstance<T>, ownerPlayer: PlayerInstanceModel) => {
        this.combatInteractor.addSpellToUnitGroup(target, spell as SpellInstance, ownerPlayer);
      },
      removeSpellFromUnitGroup: (target, spell) => {
        this.combatInteractor.removeSpellFromUnitGroup(target, spell as SpellInstance);
      },
      getUnitGroupsOfPlayer: (player) => {
        return this.battleState.heroesUnitGroupsMap.get(player) as UnitGroupInstModel[];
      },
      getAliveUnitGroupsOfPlayer: (player) => {
        return this.battleState.getAliveUnitsOfPlayer(player);
      },
      getRandomEnemyPlayerGroup: () => {
        return this.combatInteractor.getRandomEnemyUnitGroup();
      },
      getEnemyPlayer: () => {
        return this.players.getEnemyPlayer();
      },
      historyLog: (plainMsg) => {
        this.battleLog.logSimpleMessage(plainMsg);
      },
      healUnit: (unit, healValue) => {
        /* think on resorting queue */
        const healInfo = this.units.healUnit(unit, healValue);

        this.events.dispatch(UnitHealed({
          target: unit,
          healedUnitsCount: healInfo.revivedUnitsCount,
        }));
      }
    };
  }
}
