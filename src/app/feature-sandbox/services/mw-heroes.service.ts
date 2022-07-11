import { Injectable } from '@angular/core';
import { createHeroModelBase, EMPTY_RESOURCES } from 'src/app/core/dictionaries/heroes.const';
import { HeroInstanceModel, HeroModel } from 'src/app/core/model/hero.model';
import { MwItemsService } from './mw-items-service.service';
import { MwSpellsService } from './mw-spells.service';

const neutralHeroBase = createHeroModelBase({
  name: 'Taltir',
  abilities: [],
  army: [],
  items: [],
  resources: EMPTY_RESOURCES,
  stats: {
    mana: 0,
    baseAttack: 0,
  },
});

@Injectable({
  providedIn: 'root'
})
export class MwHeroesService {

  constructor(
    private itemsService: MwItemsService,
    private spellsService: MwSpellsService,
  ) { }

  public createHero(heroBase: HeroModel): HeroInstanceModel {
    const heroInitState = heroBase.initialState;
    const heroBaseStats = heroInitState.stats;

    return {
      experience: 0,
      freeSkillpoints: 0,
      items: heroInitState.items.map(item => this.itemsService.createItem(item)),
      level: 1,
      mods: [],
      name: heroBase.name,
      spells: heroInitState.abilities.map(spell => this.spellsService.createSpellInstance(spell)),
      stats: {
        baseAttack: heroBaseStats.baseAttack,
        bonusAttack: 0,
        currentMana: heroBaseStats.mana,
        maxMana: heroBaseStats.mana,
      },
      base: heroBase,
    };
  }

  public createNeutralHero(): HeroInstanceModel {
    return {
      name: null,
      experience: 0,
      level: 0,
      stats: {
        maxMana: 5,
        currentMana: 1,
        baseAttack: 0,
        bonusAttack: 0,
      },
      freeSkillpoints: 0,
      spells: [],
      mods: [],
      items: [],
      base: neutralHeroBase,
    };
  }
}
