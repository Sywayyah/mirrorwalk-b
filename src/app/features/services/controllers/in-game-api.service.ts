import { Injectable } from '@angular/core';
import { CombatActionsRef, SpellCreationOptions } from 'src/app/core/api/combat-api';
import { EffectType, VfxElemEffect } from 'src/app/core/api/vfx-api';
import { GroupAttacked, GroupModifiersChanged, GroupSpeedChanged, InitBuilding, InitBuildingAction, InitGameObjectApi, InitGameObjectApiParams, InitItem, InitItemAction, InitMapStructureAction, InitSpell, InitSpellAction, InitStructure, PlayerReceivesItem, PlayersInitialized, UnitHealed, UnitSummoned } from 'src/app/core/events';
import { GameObjectApi } from 'src/app/core/game-objects';
import { ItemEventNames, ItemsEventsGroup, ItemsEventsHandlers } from 'src/app/core/items';
import { Player } from 'src/app/core/players';
import { Spell, SpellBaseType, SpellEventHandlers, SpellEventNames, SpellEventsGroup } from 'src/app/core/spells';
import { StructEventUtilTypes, SturctEventsGroup } from 'src/app/core/structures/events';
import { BuildingEventNames, BuildingEventsHandlers, BuildingsEventsGroup } from 'src/app/core/towns/events';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { Notify, StoreClient, WireMethod } from 'src/app/store';
import { VfxService } from '../../shared/components';
import { ApiProvider } from '../api-provider.service';
import { GameObjectsManager } from '../game-objects-manager.service';
import { MwBattleLogService } from '../mw-battle-log.service';
import { BattleStateService } from '../mw-battle-state.service';
import { CombatInteractorService } from '../mw-combat-interactor.service';
import { MwItemsService } from '../mw-items.service';
import { MwPlayersService } from '../mw-players.service';
import { MwSpellsService } from '../mw-spells.service';
import { MwUnitGroupsService } from '../mw-unit-groups.service';
import { State } from '../state.service';
import { UiEventFeedService } from '../ui-event-feed.service';

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
    private apiProvider: ApiProvider,
    private state: State,
    private gameObjectsManager: GameObjectsManager,
    private eventFeed: UiEventFeedService,
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
    const baseType = spell.baseType;

    // Aura spells have different lifecycle.
    if (baseType.config.flags?.isAura) {
      return;
    }

    baseType.config.spellConfig.init({
      actions: this.createActionsApiRef(),
      events: {
        on: (handlers: SpellEventHandlers) => {
          Object.entries(handlers).forEach(([eventName, handler]) => {
            const event = SpellEventsGroup.getEventByName(eventName as SpellEventNames);

            // any for now
            this.state.eventHandlers.spells.registerHandlerByRef(spell, event as any, handler as any);
          });
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
        },
        createDroppingMessageForUnitGroup: (id, data, options) => {
          this.vfxService.createDroppingMessageForContainer(id, data, options);
        },
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
        on: (newEventHandlers: ItemsEventsHandlers) => {
          Object.entries(newEventHandlers).forEach(([eventName, handler]) => {
            const event = ItemsEventsGroup.getEventByName(eventName as ItemEventNames);

            // any as well
            this.state.eventHandlers.items.registerHandlerByRef(item, event as any, handler);
          });
        }
      },
      ownerHero: ownerPlayer.hero,
      ownerPlayer: ownerPlayer,
      thisInstance: item,
    });
  }

  @WireMethod(InitBuilding)
  public initBuilding({ building, player }: InitBuildingAction): void {
    this.state.eventHandlers.buildings.removeAllHandlersForRef(building);
    building.currentBuilding.config?.init({
      players: this.apiProvider.getPlayerApi(),
      localEvents: {
        on: (eventHandlers: BuildingEventsHandlers) => {
          Object.entries(eventHandlers).forEach(([eventName, handler]) => {
            const event = BuildingsEventsGroup.getEventByName(eventName as BuildingEventNames);

            // any as well
            this.state.eventHandlers.buildings.registerHandlerByRef(building, event as any, handler);
          });
        }
      },
      globalEvents: this.apiProvider.getGlobalEventsApi(),
      thisBuilding: building,
      gameObjects: this.gameObjectsManager,
    });
  }

  @WireMethod(InitStructure)
  public initStructureGameObject({ structure }: InitMapStructureAction): void {
    structure.generator?.config?.init({
      players: this.apiProvider.getPlayerApi(),
      thisStruct: structure,
      localEvents: {
        on: (eventHandlers: StructEventUtilTypes['EventHandlersMap']) => {
          Object.entries(eventHandlers).forEach(([eventName, handler]) => {
            const event = SturctEventsGroup.getEventByName(eventName as StructEventUtilTypes['EventNames']);

            this.state.eventHandlers.structures.registerHandlerByRef(structure, event as any, handler);
          });
        }
      },
      eventFeed: {
        postEventFeedMessage: (message) => this.eventFeed.pushEventFeedMessage(message),
        pushPlainMessage: (messageText) => this.eventFeed.pushPlainMessage(messageText),
      },
      spells: this.apiProvider.getSpellsApi(),
    });
  }

  @WireMethod(InitGameObjectApi)
  public initializeGameObjectApi(params: InitGameObjectApiParams): void {
    // hack in order to rewrite a private readonly field
    const gameObject = params.gameObject as unknown as { api: GameObjectApi };

    // unify api in some way later
    gameObject.api = {
      spells: this.apiProvider.getSpellsApi(),
      // basic exposure of global events to GameObjects
      events: {
        on: (eventType) => this.events.onEvent(eventType),
        dispatch: (event) => this.events.dispatch(event),
      },
      gameObjects: this.gameObjectsManager,
      eventFeed: {
        postEventFeedMessage: (message) => { this.eventFeed.pushEventFeedMessage(message) },
        pushPlainMessage: (messageText) => this.eventFeed.pushPlainMessage(messageText),
      },
    };
  }

  private createActionsApiRef(): CombatActionsRef {
    return {
      unitGroupAttack: (attacker, attacked) => this.events.dispatch(GroupAttacked({ attackingGroup: attacker, attackedGroup: attacked })),
      getCurrentUnitGroup: () => this.battleState.currentUnitGroup,
      summonUnitsForPlayer: (ownerPlayer: Player, unitType: UnitBaseType, unitNumber: number) => {
        const summonedUnitGroup = this.battleState.summonUnitForPlayer(ownerPlayer, unitType, unitNumber);
        this.events.dispatch(UnitSummoned({ unitGroup: summonedUnitGroup }));
        return summonedUnitGroup;
      },
      dealDamageTo: (target, damage, damageType, postActionFn) => {
        this.combatInteractor.dealDamageTo(target, damage, damageType, postActionFn);
      },
      createSpellInstance: <T>(spellBase: SpellBaseType<T>, options?: SpellCreationOptions<T>) => {
        return this.spellsService.createSpellInstance(spellBase, options);
      },
      addModifiersToUnitGroup: (target, modifiers) => {
        this.units.addModifierToUnitGroup(target, modifiers);

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
        this.units.removeModifiers(target, modifiers);

        this.events.dispatch(GroupModifiersChanged({
          unitGroup: target,
        }));
      },
      /* dark magic of types, just so it can work */
      addSpellToUnitGroup: <T>(target: UnitGroup, spell: Spell<T>, ownerPlayer: Player) => {
        this.combatInteractor.addSpellToUnitGroup(target, spell as Spell, ownerPlayer);
      },
      removeSpellFromUnitGroup: (target, spell) => {
        this.combatInteractor.removeSpellFromUnitGroup(target, spell as Spell);
      },
      getUnitGroupsOfPlayer: (player) => {
        return this.battleState.heroesUnitGroupsMap.get(player) as UnitGroup[];
      },
      getAliveUnitGroupsOfPlayer: (player) => {
        return this.battleState.getAliveUnitsOfPlayer(player);
      },
      getRandomEnemyPlayerGroup: () => {
        return this.combatInteractor.getRandomEnemyUnitGroup();
      },
      getEnemyOfPlayer: (player) => {
        return this.battleState.getEnemyOfPlayer(player);
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

        return healInfo;
      }
    };
  }
}
