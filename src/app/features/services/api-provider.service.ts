import { inject, Injectable } from '@angular/core';
import {
  GlobalEventsApi,
  PlayersApi,
  SpellsApi,
} from 'src/app/core/api/game-api';
import { ScheduleAction } from 'src/app/core/events';
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
  private readonly playersService = inject(MwPlayersService);
  private readonly heroes = inject(MwHeroesService);
  private readonly unitGroups = inject(MwUnitGroupsService);
  private readonly players = inject(MwPlayersService);
  private readonly spells = inject(MwSpellsService);
  private readonly events = inject(EventsService);
  private readonly state = inject(State);
  private readonly structures = inject(MwStructuresService);

  public getPlayerApi(): PlayersApi {
    return {
      removeUnitTypeFromPlayer: (player, unitType, count) =>
        this.players.removeUnitTypeCountFromPlayer(player, unitType, count),
      playerHasResources: (player, res) =>
        this.players.playerHasResources(player, res),
      removeResourcesFromPlayer: (player, res) =>
        this.players.removeResourcesFromPlayer(player, res),
      addExperienceToPlayer: (player, xpAmount) => {
        this.players.addExperienceToPlayer(player.id, xpAmount);
      },
      addUnitGroupToPlayer: (player, unitType, count) => {
        const unitGroup = this.unitGroups.createUnitGroup(
          unitType,
          { count },
          player.hero,
        );
        this.players.addUnitGroupToTypeStack(player, unitGroup);
      },
      addManaToPlayer: (player, mana) => {
        this.heroes.addManaToHero(player.hero, mana);
      },
      addMaxManaToPlayer: (player, mana) => {
        player.hero.addStatsMods({ heroMaxMana: mana });
      },
      giveResourceToPlayer: (player, type, amount) =>
        this.playersService.addResourceToPlayer(player, type, amount),
      addSpellToPlayerHero: (player, spell) => {
        this.heroes.addSpellToHero(player.hero, spell);
      },
      getCurrentPlayer: () => this.playersService.getCurrentPlayer(),
      getCurrentPlayerUnitGroups: () =>
        this.playersService.getUnitGroupsOfPlayer(
          this.playersService.getCurrentPlayer().id,
        ),
      giveResourcesToPlayer: (player, resources) =>
        this.playersService.addResourcesToPlayer(player, resources),
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
        },
      },
      players: this.getPlayerApi(),
      actions: {
        getMapStructures: () => this.structures.viewStructures,
        getActionPointsLeft: () => this.state.currentGame.actionPoints,
        scheduleAction: (action, days) => {
          this.events.dispatch(ScheduleAction({ action, dayOffset: days }));
        },
        getTownOfPlayer: (player) => this.state.townsByPlayers.get(player.id),
      },
    };
  }

  public getGlobalEventsApi(): GlobalEventsApi {
    return {
      dispatch: (event) => this.events.dispatch(event),
    };
  }
}
