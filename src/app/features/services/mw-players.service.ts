import { Injectable } from '@angular/core';
import { PlayerLevelsUp, PlayerReceivesItem, PlayerUnequipsItem } from 'src/app/core/events';
import { HERO_LEVELS_BREAKPOINTS, HeroBase } from 'src/app/core/heroes';
import { Item } from 'src/app/core/items';
import { Player, PlayerCreationModel, PlayerTypeEnum } from 'src/app/core/players';
import { ResourceType, Resources, ResourcesModel } from 'src/app/core/resources';
import { UnitBaseType, UnitGroup } from 'src/app/core/unit-types';
import { StoreClient } from 'src/app/store';
import { MwHeroesService, MwUnitGroupsService } from './';
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

  // theoretically, if objects are being stored in manager, I might access them
  // from manager.
  private get playersMap(): Map<string, Player> {
    return this.state.gameState.playersMap;
  };

  private currentPlayerId: string = this.gameObjectsManager.getObjectId(Player, PLAYER_IDS.Main);

  constructor(
    private readonly heroesService: MwHeroesService,
    private readonly unitGroups: MwUnitGroupsService,
    private readonly state: State,
    private readonly gameObjectsManager: GameObjectsManager,
  ) {
    super();
  }

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

  public getPlayerUnitsCountOfType(player: Player, unitType: UnitBaseType): number {
    return player.hero.unitGroups.reduce((totalCount, nextUnitGroupType) => totalCount + (nextUnitGroupType.type === unitType ? nextUnitGroupType.count : 0), 0);
  }

  public addExperienceToPlayer(playerId: string, experience: number): void {
    const player = this.getPlayerById(playerId);
    const playerHero = player.hero;
    playerHero.experience += experience;

    const currentXpToNextLevel = HERO_LEVELS_BREAKPOINTS[playerHero.level + 1];

    // handle overstacked level
    if (currentXpToNextLevel <= playerHero.experience) {
      playerHero.level++;
      playerHero.freeSkillpoints++;
      playerHero.experience = playerHero.experience - currentXpToNextLevel;

      // theoretically, overstacked skillpoints can be sent here
      this.events.dispatch(PlayerLevelsUp({ newLevel: playerHero.level, hero: playerHero }));
    }
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

    if (unitGroup.count <= 0) {
      player.hero.removeUnitGroup(unitGroup);
    }
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
