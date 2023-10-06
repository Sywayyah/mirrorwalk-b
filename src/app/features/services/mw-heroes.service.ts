import { Injectable } from '@angular/core';
import { Hero, HeroBase } from 'src/app/core/heroes';
import { EMPTY_RESOURCES, createHeroModelBase } from 'src/app/core/heroes/utils';
import { Spell } from 'src/app/core/spells';
import { heroDescrElem } from 'src/app/core/ui';
import { GameObjectsManager } from './game-objects-manager.service';

const neutralHeroBase = createHeroModelBase({
  name: 'neutral-hero',
  generalDescription: heroDescrElem(''),
  abilities: [],
  army: [],
  items: [],
  resources: EMPTY_RESOURCES,
  stats: {
    mana: 0,
    baseAttack: 0,
    baseDefence: 0,
  },
});

@Injectable({
  providedIn: 'root'
})
export class MwHeroesService {
  constructor(
    private gameObjectsManager: GameObjectsManager,
  ) { }

  public addManaToHero(hero: Hero, mana: number): void {
    hero.addMana(mana);
  }

  public addSpellToHero(hero: Hero, spell: Spell): void {
    hero.spells.push(spell);
  }

  public createHero(heroBase: HeroBase): Hero {
    return this.gameObjectsManager.createNewGameObject(Hero, {
      heroBase,
    });
  }

  public createNeutralHero(): Hero {
    return this.createHero(neutralHeroBase);
  }
}
