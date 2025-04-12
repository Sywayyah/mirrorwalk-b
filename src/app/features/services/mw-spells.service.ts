import { inject, Injectable } from '@angular/core';
import { SpellCreationOptions } from 'src/app/core/api/combat-api';
import { Colors } from 'src/app/core/assets';
import { Modifiers } from 'src/app/core/modifiers';
import { Spell, SpellBaseType } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { GameObjectsManager } from './game-objects-manager.service';


@Injectable({
  providedIn: 'root'
})
export class MwSpellsService {
  private gameObjectManager = inject(GameObjectsManager);

  public createSpellInstance<T>(
    spell: SpellBaseType<T>,
    options: SpellCreationOptions<T> = {},
  ): Spell<T> {
    const initialLevel: number = options.initialLevel ?? 1;
    const spellIcon = spell.icon;

    if (!spellIcon.bgClr) {
      spellIcon.bgClr = Colors.DefaultItemIconBg;
    }

    if (!spellIcon.iconClr) {
      spellIcon.iconClr = Colors.DefaultItemIconClr;
    }

    const spellInstance = this.gameObjectManager.createNewGameObject(Spell<T>, {
      spellBaseType: spell,
      initialLevel: initialLevel,
      state: options.state,
    });

    return spellInstance;
  }

  public createModifiers(modifiers: Modifiers): Modifiers {
    return modifiers;
  }

  public canSpellBeCastOnUnit(spell: Spell, unitGroup: UnitGroup, isEnemy: boolean): boolean {
    const spellConfig = spell.baseType.config.spellConfig;

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
