import { Injectable } from '@angular/core';
import { GlobalEventsApi, PlayersApi, SpellsApi } from 'src/app/core/api/game-api';
import { GameApi } from 'src/app/core/triggers';
import { EventsService } from 'src/app/store';
import { MwHeroesService } from './mw-heroes.service';
import { MwPlayersService } from './mw-players.service';
import { MwSpellsService } from './mw-spells.service';
import { MwStructuresService } from './mw-structures.service';
import { MwUnitGroupsService } from './mw-unit-groups.service';
import { State } from './state.service';

@Injectable({
  providedIn: 'root',
})
export class ApiProvider {
  constructor(
    private readonly playersService: MwPlayersService,
    private readonly heroes: MwHeroesService,
    private readonly unitGroups: MwUnitGroupsService,
    private readonly players: MwPlayersService,
    private readonly spells: MwSpellsService,
    private readonly events: EventsService,
    private readonly state: State,
    private readonly structures: MwStructuresService,
  ) {
  }

  public getPlayerApi(): PlayersApi {
    return {
      addExperienceToPlayer: (player, xpAmount) => {
        this.players.addExperienceToPlayer(player.id, xpAmount);
      },
      addUnitGroupToPlayer: (player, unitType, count) => {
        const unitGroup = this.unitGroups.createUnitGroup(unitType, { count }, player);
        this.players.addUnitGroupToTypeStack(player, unitGroup);
      },
      addManaToPlayer: (player, mana) => {
        this.heroes.addManaToHero(player.hero, mana);
      },
      addMaxManaToPlayer: (player, mana) => {
        player.hero.addStatsMods({ heroMaxMana: mana });
      },
      giveResourceToPlayer: (player, type, amount) => this.playersService.addResourceToPlayer(player, type, amount),
      addSpellToPlayerHero: (player, spell) => {
        this.heroes.addSpellToHero(player.hero, spell);
      },
      getCurrentPlayer: () => this.playersService.getCurrentPlayer(),
      getCurrentPlayerUnitGroups: () => this.playersService.getUnitGroupsOfPlayer(this.playersService.getCurrentPlayer().id),
      giveResourcesToPlayer: (player, resources) => this.playersService.addResourcesToPlayer(player, resources),
    };
  }

  public getSpellsApi(): SpellsApi {
    return {
      createSpellInstance: (spell, options) => {
        return this.spells.createSpellInstance(spell, options);
      },
    };
  }

  public getGameApi(): GameApi {
    return {
      events: {
        dispatch: (eventData) => {
          this.events.dispatch(eventData);
        }
      },
      players: this.getPlayerApi(),
      actions: {
        getMapStructures: () => this.structures.viewStructures,
        getActionPointsLeft: () => this.state.currentGame.actionPoints
      },
    }
  }

  public getGlobalEventsApi(): GlobalEventsApi {
    return {
      dispatch: (event) => this.events.dispatch(event),
    };
  }
}
