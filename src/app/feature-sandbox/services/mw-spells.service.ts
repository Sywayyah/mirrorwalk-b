import { Injectable } from '@angular/core';
import { SpellCreationOptions, SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { Modifiers } from 'src/app/core/model/spells/modifiers';



@Injectable({
  providedIn: 'root'
})
export class MwSpellsService {

  constructor() { }

  public createSpellInstance<T>(spell: SpellModel<T>, options: SpellCreationOptions<T> = {}): SpellInstance<T> {
    const initialLevel: number = options.initialLevel ?? 1;

    const spellInstance: SpellInstance<T> = {
      currentLevel: initialLevel,
      currentManaCost: 0,
      description: spell.description ?? '',
      name: spell.type.spellInfo.name,
      type: spell,
      state: options.state ?? null,
    };

    spellInstance.currentManaCost = spell.type.spellConfig.getManaCost(spellInstance);

    return spellInstance;
  }

  public createModifiers(modifiers: Modifiers): Modifiers {
    return modifiers;
  }
}
