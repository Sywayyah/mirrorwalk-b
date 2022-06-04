import { Injectable } from '@angular/core';
import { SpellModel } from 'src/app/core/model/main.model';

@Injectable({
  providedIn: 'root'
})
export class MwSpellsService {

  constructor() { }

  public createSpell(spell: SpellModel): SpellModel {
    return spell;
  }
}
