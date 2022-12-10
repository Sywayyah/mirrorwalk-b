import { Injectable } from '@angular/core';
import { PlayersApi, SpellsApi } from 'src/app/core/api/game-api';
import { MwHeroesService } from './mw-heroes.service';
import { MwPlayersService } from './mw-players.service';
import { MwSpellsService } from './mw-spells.service';
import { MwUnitGroupsService } from './mw-unit-groups.service';

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
        this.heroes.addMaxManaToHero(player.hero, mana);
      },
      addResourcesToPlayer: (player, type, amount) => this.playersService.addResourcesToPlayer(player, type, amount),
      addSpellToPlayerHero: (player, spell) => {
        this.heroes.addSpellToHero(player.hero, spell);
      },
      getCurrentPlayer: () => this.playersService.getCurrentPlayer(),
      getCurrentPlayerUnitGroups: () => this.playersService.getUnitGroupsOfPlayer(this.playersService.getCurrentPlayer().id),
    };
  }

  public getSpellsApi(): SpellsApi {
    return {
      createSpellInstance: (spell, options) => {
        return this.spells.createSpellInstance(spell, options);
      },
    };
  }
}
