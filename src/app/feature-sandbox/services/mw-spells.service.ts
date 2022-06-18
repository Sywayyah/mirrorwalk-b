import { Injectable } from '@angular/core';
import { SpellInstance, SpellModel } from 'src/app/core/model/spells';
import { Modifiers } from 'src/app/core/model/modifiers';
import { SpellCreationOptions } from 'src/app/core/model/combat-api/combat-api.types';



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
      baseType: spell,
      state: options.state ?? null,
    };

    spellInstance.currentManaCost = spell.type.spellConfig.getManaCost(spellInstance);

    return spellInstance;
  }

  public createModifiers(modifiers: Modifiers): Modifiers {
    return modifiers;
  }
}
