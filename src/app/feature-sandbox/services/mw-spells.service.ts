import { Injectable } from '@angular/core';
import { SpellCreationOptions, SpellInstance, SpellModel } from 'src/app/core/model/spells';



@Injectable({
  providedIn: 'root'
})
export class MwSpellsService {

  constructor() { }

  public createSpellInstance<T>(spell: SpellModel<T>, options: SpellCreationOptions<T> = {}): SpellInstance<T> {
    return {
      currentLevel: options.initialLevel ?? 1,
      currentManaCost: 0,
      description: spell.description ?? '',
      name: spell.type.spellInfo.name,
      type: spell,
      state: options.state ?? null,
    };
  }
}
