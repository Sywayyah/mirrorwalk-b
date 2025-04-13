import { inject, Injectable } from '@angular/core';
import { UnitTypeId } from 'src/app/core/entities';
import { PlayerReceivesItem, PlayerUnequipsItem } from 'src/app/core/events';
import { HeroBase } from 'src/app/core/heroes';
import { Item } from 'src/app/core/items';
import { Player, PlayerCreationModel, PlayerTypeEnum } from 'src/app/core/players';
import { Resources, ResourcesModel, ResourceType } from 'src/app/core/resources';
import { UnitGroup } from 'src/app/core/unit-types';
import { StoreClient } from 'src/app/store';
import { MwHeroesService } from './';
import { GameObjectsManager } from './game-objects-manager.service';
import { State } from './state.service';

export enum PLAYER_IDS {
  Main = 'main',
  Neutral = 'neutral',
}

const defaultResources: ResourcesModel = {
  gems: 0,
  gold: 0,
  redCrystals: 0,
  wood: 0,
}

@Injectable({
  providedIn: 'root'
})
export class MwPlayersService extends StoreClient() {
  private readonly heroesService = inject(MwHeroesService);
  private readonly state = inject(State);
  private readonly gameObjectsManager = inject(GameObjectsManager);

  // theoretically, if objects are being stored in manager, I might access them
  // from manager.
  private get playersMap(): Map<string, Player> {
    return this.state.gameState.playersMap;
  };

  private currentPlayerId: string = this.gameObjectsManager.getObjectId(Player, PLAYER_IDS.Main);

  public createPlayer(id: string, playerInfo: PlayerCreationModel): Player {
    return this.gameObjectsManager.createNewGameObject(Player, playerInfo, id);
  }

  public getCurrentPlayer(): Player {
    return this.playersMap.get(this.currentPlayerId)!;
  }

  public addResourceToPlayer(
    player: Player,
    resource: ResourceType,
    amount: number,
  ): void {
    player.resources[resource] += amount;
  }

  public addResourcesToPlayer(player: Player, resources: Resources): void {
    Object.entries(resources).forEach(([res, count]) => player.resources[res as ResourceType] += count);
  }

  public removeResourcesFromPlayer(
    player: Player,
    resources: Resources,
  ): void {
    Object.entries(resources).forEach(([res, count]) => player.resources[res as ResourceType] -= count);
  }

  public playerHasResources(
    player: Player,
    resources: Resources,
  ): boolean {
    const playerResources = player.resources;

    return Object.entries(resources).every(([res, count]) => playerResources[res as ResourceType] >= count);
  }

  public getMissingResources(
    player: Player,
    resources: Resources,
  ): Resources {
    const playerResources = player.resources;

    return Object.entries(resources).reduce((resMap, [res, count]) => {
      const resDiff = playerResources[res as ResourceType] - count;

      if (resDiff < 0) {
        resMap[res as ResourceType] = Math.abs(resDiff);
      }

      return resMap;
    }, {} as Resources);
  }

  public getCurrentPlayerId(): string {
    return this.currentPlayerId;
  }

  public isEnemyUnitGroup(unitGroup: UnitGroup): boolean {
    return this.getUnitGroupsOfPlayer(this.getEnemyPlayer().id).includes(unitGroup);
  }

  public getPlayerUnitsCountOfType(player: Player, unitType: UnitTypeId): number {
    return player.hero.unitGroups.reduce((totalCount, nextUnitGroupType) => totalCount + (nextUnitGroupType.type.id === unitType ? nextUnitGroupType.count : 0), 0);
  }

  public addExperienceToPlayersHero(playerId: string, experience: number): void {
    const player = this.getPlayerById(playerId);
    const playerHero = player.hero;
    playerHero.addExperience(experience);
  }

  public getPlayerById(playerId: string): Player {
    return this.playersMap.get(this.gameObjectsManager.getObjectId(Player, playerId))!;
  }

  public getNeutralPlayer(): Player {
    return this.playersMap.get(this.gameObjectsManager.getObjectId(Player, PLAYER_IDS.Neutral))!;
  }

  public getEnemyPlayer(): Player {
    /* Might be changed */
    return this.getNeutralPlayer();
  }

  public getUnitGroupsOfPlayer(playerId: string): UnitGroup[] {
    const player = this.playersMap.get(this.gameObjectsManager.getObjectId(Player, playerId))!;

    return player.hero.unitGroups;
  }

  public addUnitGroupToTypeStack(player: Player, unitGroup: UnitGroup): void {
    // todo: move these things into classes.
    const sameTypeStack = player.hero.unitGroups.find(group => group.type === unitGroup.type);
    if (sameTypeStack) {
      sameTypeStack.addUnitsCount(unitGroup.count);
    } else {
      player.hero.addUnitGroup(unitGroup);
    }
  }

  /* todo: rework this method later, allow to check several stacks */
  public removeNUnitsFromGroup(player: Player, unitGroup: UnitGroup, count: number): void {
    unitGroup.addUnitsCount(-count);

    // Handle hero, destroy unit group and remove it from slot
    if (unitGroup.count <= 0) {
      player.hero.removeUnitGroup(unitGroup);

      this.gameObjectsManager.destroyObject(unitGroup);
      const stackWithRemovedUnit = unitGroup.ownerHero.getAllSlots().find(slot => slot.unitGroup === unitGroup);

      if (stackWithRemovedUnit) {
        stackWithRemovedUnit.unitGroup = null;
      }
    }
  }

  removeUnitTypeCountFromPlayer(player: Player, unitType: UnitTypeId, count: number): number {
    const stacksOfType = player.hero.getAllUnitsFromSlots().filter(unitGroup => unitGroup.type.id === unitType);

    const totalCount = stacksOfType.reduce((acc, nextUnit) => nextUnit.count + acc, 0);

    const totalUnitsToRemove = totalCount < count ? totalCount : count;
    let unitsLeftToRemove = totalUnitsToRemove;

    let i = 0;

    while (unitsLeftToRemove > 0) {
      const stackOfType = stacksOfType[i++];

      const stackCount = stackOfType.count;

      const toRemoveFromStack = unitsLeftToRemove > stackCount ? stackCount : unitsLeftToRemove;

      this.removeNUnitsFromGroup(player, stackOfType, toRemoveFromStack);

      unitsLeftToRemove -= toRemoveFromStack;
    }

    return totalUnitsToRemove;
  }

  public addManaToPlayer(player: Player, mana: number): void {
    player.hero.addMana(mana);
  }

  public addItemToPlayer(player: Player, item: Item): void {
    this.events.dispatch(PlayerReceivesItem({ player, item }));
  }

  public removeItemFromPlayer(player: Player, item: Item): void {
    this.events.dispatch(PlayerUnequipsItem({ player, item }));
  }

  public createPlayerWithHero(
    color: string,
    hero: HeroBase,
    type: PlayerTypeEnum,
  ): PlayerCreationModel {
    return {
      color,
      hero: this.heroesService.createHero(hero),
      resources: hero.initialState.resources,
      type,
    };
  }
}
