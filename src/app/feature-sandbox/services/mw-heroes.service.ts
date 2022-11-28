import { Injectable } from '@angular/core';
import { HeroInstanceModel, HeroModel } from 'src/app/core/heroes';
import { createHeroModelBase, EMPTY_RESOURCES } from 'src/app/core/heroes/utils';
import { SpellInstance } from 'src/app/core/spells';
import { MwItemsService, MwSpellsService } from './';

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

  public addManaToHero(hero: HeroInstanceModel, mana: number): void {
    const heroStats = hero.stats;
    const newMana = heroStats.currentMana + mana;

    heroStats.currentMana = newMana > heroStats.maxMana ? heroStats.maxMana : newMana;
  }

  public addSpellToHero(hero: HeroInstanceModel, spell: SpellInstance): void {
    hero.spells.push(spell)
  }

  public addMaxManaToHero(hero: HeroInstanceModel, maxMana: number): void {
    hero.stats.maxMana += maxMana;
  }

  public createHero(heroBase: HeroModel): HeroInstanceModel {
    const heroInitState = heroBase.initialState;
    const heroBaseStats = heroInitState.stats;

    return {
      experience: 0,
      freeSkillpoints: 0,
      items: [],
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
