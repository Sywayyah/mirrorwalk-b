import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/assets';
import { HeroBase, HERO_LEVELS_BREAKPOINTS } from 'src/app/core/heroes';
import { HelveticaHero } from 'src/app/core/heroes/humans';
import { ItemInstanceModel } from 'src/app/core/items';
import { PlayerInstanceModel, PlayerModel, PlayerTypeEnum } from 'src/app/core/players';
import { ResourcesModel } from 'src/app/core/resources';
import { CommonUtils, UnitGroupInstModel, UnitGroupModel } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { MwHeroesService, MwUnitGroupsService } from './';
import { PlayerEquipsItem, PlayerGainsLevel, PlayerUnequipsItem } from './events/';


// const mainPlayerGroups = GenerationUtils.createRandomArmy({
//   fraction: HUMANS_FRACTION_UNIT_TYPES,
//   maxUnitGroups: 3,
//   minUnitGroups: 1,
//   units: [
//     [HF_TYPES_ENUM.Pikemans, 10, 22, 3],
//     [HF_TYPES_ENUM.Archers, 12, 20, 1],
//     [HF_TYPES_ENUM.Knights, 5, 9, 1],
//     [HF_TYPES_ENUM.Cavalry, 3, 5, 1],
//   ],
// });

// const neutralGroups = GenerationUtils.createRandomArmy({
//   fraction: NEUTRAL_FRACTION_UNIT_TYPES,
//   maxUnitGroups: 5,
//   minUnitGroups: 2,
//   units: [
//     [NEUTRAL_TYPES_ENUM.Gnolls, 10, 40, 3],
//     // [NEUTRAL_TYPES_ENUM.Gnolls, 10, 15, 3],
//     [NEUTRAL_TYPES_ENUM.ForestTrolls, 10, 25, 2],
//     [NEUTRAL_TYPES_ENUM.Thiefs, 12, 37, 2],
//     [NEUTRAL_TYPES_ENUM.Ghosts, 24, 42, 3],
//   ],
// });

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
export class MwPlayersService {

  public players: Map<string, PlayerInstanceModel> = new Map([
    this.createPlayerEntry(PLAYER_IDS.Main, this.createPlayerWithHero(
      PLAYER_COLORS.BLUE,
      HelveticaHero,
      PlayerTypeEnum.Player,
    )),

    this.createPlayerEntry(PLAYER_IDS.Neutral, {
      color: PLAYER_COLORS.GRAY,
      type: PlayerTypeEnum.AI,
      hero: this.heroesService.createNeutralHero(),
      unitGroups: [],
      resources: {
        ...defaultResources,
      },
    }),
  ]);

  private currentPlayerId: string = PLAYER_IDS.Main;

  constructor(
    private readonly heroesService: MwHeroesService,
    private readonly unitGroups: MwUnitGroupsService,
    private events: EventsService,
  ) { }

  public getCurrentPlayer(): PlayerInstanceModel {
    return this.players.get(this.currentPlayerId) as PlayerInstanceModel;
  }

  public getCurrentPlayerId(): string {
    return this.currentPlayerId;
  }

  public isEnemyUnitGroup(unitGroup: UnitGroupInstModel): boolean {
    return this.getUnitGroupsOfPlayer(this.getEnemyPlayer().id).includes(unitGroup);
  }

  public addExperienceToPlayer(playerId: string, experience: number): void {
    const player = this.getPlayerById(playerId);
    const playerHero = player.hero;
    playerHero.experience += experience;

    const currentXpToNextLevel = HERO_LEVELS_BREAKPOINTS[playerHero.level + 1];

    if (currentXpToNextLevel <= playerHero.experience) {
      playerHero.level++;
      playerHero.freeSkillpoints++;
      playerHero.experience = playerHero.experience - currentXpToNextLevel;

      this.events.dispatch(PlayerGainsLevel({}));
    }
  }

  public getPlayerById(playerId: string): PlayerInstanceModel {
    return this.players.get(playerId) as PlayerInstanceModel;
  }

  public getEnemyPlayer(): PlayerInstanceModel {
    return this.players.get(PLAYER_IDS.Neutral) as PlayerInstanceModel;
  }

  public getUnitGroupsOfPlayer(playerId: string): UnitGroupInstModel[] {
    const player = this.players.get(playerId) as PlayerInstanceModel;
    return player.unitGroups.map((unitGroup: UnitGroupModel) => {
      unitGroup.ownerPlayerRef = player;

      const unitGroupInstance = unitGroup as UnitGroupInstModel;

      unitGroupInstance.spells = unitGroupInstance.spells ?? [];

      return unitGroupInstance;
    })
  }

  public addUnitGroupToTypeStack(player: PlayerModel, unitGroup: UnitGroupModel): void {
    const sameTypeStack = player.unitGroups.find(group => group.type === unitGroup.type);
    if (sameTypeStack) {
      sameTypeStack.count += unitGroup.count;
    } else {
      player.unitGroups.push(unitGroup);
    }
  }

  public removeNUnitsFromGroup(player: PlayerModel, unitGroup: UnitGroupModel, count: number): void {
    unitGroup.count -= count;

    if (unitGroup.count <= 0) {
      CommonUtils.removeItem(player.unitGroups, unitGroup);
    }
  }

  public addManaToPlayer(player: PlayerInstanceModel, mana: number): void {
    player.hero.stats.currentMana += mana;
  }

  public addItemToPlayer(player: PlayerInstanceModel, item: ItemInstanceModel): void {
    this.events.dispatch(PlayerEquipsItem({ player, item }));
  }

  public removeItemFromPlayer(player: PlayerInstanceModel, item: ItemInstanceModel): void {
    this.events.dispatch(PlayerUnequipsItem({ player, item }));
  }

  private createPlayer(id: string, playerInfo: PlayerModel): PlayerInstanceModel {
    const player: PlayerInstanceModel = {
      id,
      ...playerInfo,
    };

    return player;
  }

  private createPlayerEntry(id: string, playerInfo: PlayerModel): [string, PlayerInstanceModel] {
    return [id, this.createPlayer(id, playerInfo)];
  }

  private createPlayerWithHero(
    color: string,
    hero: HeroBase,
    type: PlayerTypeEnum,
  ): PlayerModel {
    const player = {
      color,
      hero: this.heroesService.createHero(hero),
      resources: hero.initialState.resources,
      type,
      unitGroups: this.unitGroups.createUnitGroupFromGenModel(hero.initialState.army[0]),
    };

    return player;
  }
}
