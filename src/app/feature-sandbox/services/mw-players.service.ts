import { Injectable } from '@angular/core';
import { PLAYER_COLORS } from 'src/app/core/dictionaries/colors.const';
import { HelveticaHero } from 'src/app/core/dictionaries/heroes.const';
import { LEVELS_BREAKPOINTS } from 'src/app/core/dictionaries/levels.const';
import { HeroModel } from 'src/app/core/model/hero.model';
import { ItemInstanceModel } from 'src/app/core/model/items/items.types';
import { PlayerInstanceModel, PlayerModel, PlayerTypeEnum, UnitGroupInstModel, UnitGroupModel } from 'src/app/core/model/main.model';
import { ResourcesModel } from 'src/app/core/model/resources.types';
import { CommonUtils } from 'src/app/core/utils/common.utils';
import { BattleEventsService } from './mw-battle-events.service';
import { MwHeroesService } from './mw-heroes.service';
import { MwItemsService } from './mw-items-service.service';
import { MwSpellsService } from './mw-spells.service';
import { MwUnitGroupsService } from './mw-unit-groups.service';
import { BattleEvent } from './types';


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
    private readonly events: BattleEventsService,
    private readonly spellsService: MwSpellsService,
    private readonly itemsService: MwItemsService,
    private readonly heroesService: MwHeroesService,
    private readonly unitGroups: MwUnitGroupsService,
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

    const currentXpToNextLevel = LEVELS_BREAKPOINTS[playerHero.level + 1];

    if (currentXpToNextLevel <= playerHero.experience) {
      playerHero.level++;
      playerHero.freeSkillpoints++;
      playerHero.experience = playerHero.experience - currentXpToNextLevel;
      this.events.dispatchEvent({ type: BattleEvent.Player_Gains_Level });
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

  public addManaToPlayer(player: PlayerInstanceModel, mana: number): void {
    player.hero.stats.currentMana += mana;
  }

  public addItemToPlayer(player: PlayerInstanceModel, item: ItemInstanceModel): void {
    player.hero.items.push(item);
    player.hero.mods.push(item.baseType.staticMods);
    if (item.baseType.staticMods.playerBonusAttack) {
      player.hero.stats.bonusAttack += item.baseType.staticMods.playerBonusAttack;
    }
    this.itemsService.registerItemsEventHandlers(item, player);
  }

  public removeItemFromPlayer(player: PlayerInstanceModel, item: ItemInstanceModel): void {
    CommonUtils.removeItem(player.hero.items, item);
    CommonUtils.removeItem(player.hero.mods, item.baseType.staticMods);
    if (item.baseType.staticMods.playerBonusAttack) {
      player.hero.stats.bonusAttack -= item.baseType.staticMods.playerBonusAttack;
    }
  }

  private createPlayer(id: string, playerInfo: PlayerModel): PlayerInstanceModel {
    const player: PlayerInstanceModel = {
      id,
      ...playerInfo,
    }

    return player;
  }

  private createPlayerEntry(id: string, playerInfo: PlayerModel): [string, PlayerInstanceModel] {
    return [id, this.createPlayer(id, playerInfo)];
  }

  private createPlayerWithHero(
    color: string,
    hero: HeroModel,
    type: PlayerTypeEnum,
  ): PlayerModel {
    const player = {
      color,
      hero: this.heroesService.createHero(hero),
      resources: hero.initialState.resources,
      type,
      unitGroups: this.unitGroups.createUnitGroupFromGenModel(hero.initialState.army[0]),
    };
    /* handle items initialization */

    return player;
  }
}
