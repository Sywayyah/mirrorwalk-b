import { inject, Injectable } from '@angular/core';
import { Hero, HeroBase } from 'src/app/core/heroes';
import { EMPTY_RESOURCES, createHeroModelBase } from 'src/app/core/heroes/utils';
import { Spell } from 'src/app/core/spells';
import { heroDescrElem } from 'src/app/core/ui';
import { GameObjectsManager } from './game-objects-manager.service';
import { MwUnitGroupsService } from './mw-unit-groups.service';
import { CONFIG } from 'src/app/core/config';

const neutralHeroBase = createHeroModelBase({
  id: '#hero-non-player-neutral',
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
  private gameObjectsManager = inject(GameObjectsManager);
  private unitGroups = inject(MwUnitGroupsService);

  public addManaToHero(hero: Hero, mana: number): void {
    hero.addMana(mana);
  }

  public addSpellToHero(hero: Hero, spell: Spell): void {
    hero.spells.push(spell);
  }

  public createHero(heroBase: HeroBase): Hero {
    return this.gameObjectsManager.createNewGameObject(Hero, {
      heroBase,
      unitGroups: heroBase.initialState.army.length
        ? [
          ...this.unitGroups.createUnitGroupFromGenModel(heroBase.initialState.army[0]),
          ...CONFIG.enableHeroUnits ? [this.unitGroups.createUnitGroup(`#unit-!hero-${heroBase.id}`, { count: 1 })] : [],
        ]
        : [],
    });
  }

  public createNeutralHero(): Hero {
    return this.createHero(neutralHeroBase);
  }
}
