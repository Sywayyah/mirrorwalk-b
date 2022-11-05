import { Injectable } from '@angular/core';
import { Colors } from 'src/app/core/dictionaries/colors.const';
import { Modifiers, SpellInstance, SpellModel, UnitGroupInstModel } from 'src/app/core/model';
import { SpellCreationOptions } from 'src/app/core/model/combat-api/combat-api.types';



@Injectable({
  providedIn: 'root'
})
export class MwSpellsService {

  constructor() { }

  public createSpellInstance<T>(
    spell: SpellModel<T>,
    options: SpellCreationOptions<T> = {},
  ): SpellInstance<T> {
    const initialLevel: number = options.initialLevel ?? 1;
    const spellIcon = spell.icon;

    if (!spellIcon.bgClr) {
      spellIcon.bgClr = Colors.DefaultItemIconBg;
    }

    if (!spellIcon.iconClr) {
      spellIcon.iconClr = Colors.DefaultItemIconClr;
    }

    const spellInstance: SpellInstance<T> = {
      currentLevel: initialLevel,
      currentManaCost: 0,
      description: spell.description ?? '',
      name: spell.type.spellInfo.name,
      baseType: spell,
      state: options.state ?? null,
      sourceInfo: {},
    };

    spellInstance.currentManaCost = spell.type.spellConfig.getManaCost(spellInstance);

    return spellInstance;
  }

  public createModifiers(modifiers: Modifiers): Modifiers {
    return modifiers;
  }

  public canSpellBeCastOnUnit(spell: SpellInstance, unitGroup: UnitGroupInstModel, isEnemy: boolean): boolean {
    const spellConfig = spell.baseType.type.spellConfig;

    const canActivateFn = spellConfig.targetCastConfig?.canActivate;

    if (!canActivateFn) {
      return true;
    }

    return canActivateFn({
      unitGroup: unitGroup,
      isEnemy: isEnemy,
    });
  }
}
