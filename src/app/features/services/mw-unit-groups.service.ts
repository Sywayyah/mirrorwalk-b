import { Injectable } from '@angular/core';
import { HealingInfo } from 'src/app/core/api/combat-api';
import { AddCombatModifiersToUnit, RemoveCombatModifiersFromUnit } from 'src/app/core/events/battle/commands';
import { Modifiers, ModifiersModel } from 'src/app/core/modifiers';
import { Player } from 'src/app/core/players';
import { GenerationModel, UnitBaseType, UnitGroup, UnitsUtils } from 'src/app/core/unit-types';
import { EventsService } from 'src/app/store';
import { GameObjectsManager } from './game-objects-manager.service';
import { MwSpellsService } from './mw-spells.service';


export type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T];

export interface UIModsModel {
  speed: number,
  attack: number;
}

@Injectable({
  providedIn: 'root'
})
export class MwUnitGroupsService {

  constructor(
    private spells: MwSpellsService,
    private gameObjectsManager: GameObjectsManager,
    private events: EventsService,
  ) { }
  /* todo: unify it */
  /*  todo: figure out diff between UnitGroupModel and Inst */

  public createUnitGroup(
    type: UnitBaseType,
    options: { count: number },
    player?: Player,
  ): UnitGroup {
    const unitGroup: UnitGroup = this.gameObjectsManager.createNewGameObject(
      UnitGroup,
      {
        count: options.count,
        ownerPlayer: player,
        unitBase: type,
      },
    );

    return unitGroup;
  }

  public createUnitGroupFromGenModel(
    genModel: GenerationModel,
  ): UnitGroup[] {
    return UnitsUtils
      .createRandomArmy(genModel)
      .map(unitGenModel => this.createUnitGroup(unitGenModel.unitType, { count: unitGenModel.count }));
  }

  public createUnitGroupFromGenModelForPlayer(
    genModel: GenerationModel,
    player: Player,
  ): UnitGroup[] {
    return UnitsUtils
      .createRandomArmy(genModel)
      .map(unitGenModel => this.createUnitGroup(unitGenModel.unitType, { count: unitGenModel.count }, player));
  }

  // these methods might become obsolete
  public addModifierToUnitGroup(target: UnitGroup, modifiers: Modifiers) {
    this.events.dispatch(AddCombatModifiersToUnit({ mods: modifiers, unit: target }));
  }

  public removeModifiers(target: UnitGroup, modifiers: Modifiers): void {
    this.events.dispatch(RemoveCombatModifiersFromUnit({ mods: modifiers, unit: target }));
  }

  public clearUnitModifiers(target: UnitGroup): void {
    target.clearCombatMods();
  }

  public getUnitGroupSpeed(unitGroup: UnitGroup): number {
    return unitGroup.getStats().finalSpeed;
  }

  /*
   This might be theoretically split into a data function and executing function,
     in the same manner as damage functions.
   */
  public healUnit(unit: UnitGroup, healValue: number): HealingInfo {
    const singleUnitHealth = unit.type.baseStats.health;

    let fullyRevivedUnitsCount = Math.floor(healValue / singleUnitHealth);

    let fullHealValueWithoutTail = fullyRevivedUnitsCount * singleUnitHealth;

    let healValueTail = healValue - fullHealValueWithoutTail;

    const initialUnitsCount = unit.fightInfo.initialCount;

    const currentUnitsCount = unit.count;

    const totalUnitsLoss = initialUnitsCount - currentUnitsCount;

    // singleUnitHealth only if tail is undefined, think about it later
    const currentTailHp = unit.tailUnitHp || singleUnitHealth;

    const lossTailHp = singleUnitHealth - currentTailHp;

    const totalHpLoss = (totalUnitsLoss * singleUnitHealth) + lossTailHp;

    // if no losses or no heal value, do nothing and return 0
    if (totalHpLoss === 0 || healValue <= 0) {
      return {
        revivedUnitsCount: 0,
        totalHealedHp: 0,
      };
    }

    unit.fightInfo.isAlive = true;

    // if heal is greater than overall loss, heal out to max
    if (healValue > totalHpLoss) {
      unit.tailUnitHp = singleUnitHealth;
      unit.setUnitsCount(initialUnitsCount);

      return {
        revivedUnitsCount: totalUnitsLoss,
        totalHealedHp: totalHpLoss,
      };
    }

    let unitsToRevive = fullyRevivedUnitsCount;

    // if heal of tail exceeds tail loss
    if (healValueTail > lossTailHp) {
      unitsToRevive += 1;
      unit.tailUnitHp = (currentTailHp + healValueTail) - singleUnitHealth;
    } else {
      if (unit.tailUnitHp === 0 && healValueTail === 0 && unitsToRevive > 0) {
        unit.tailUnitHp = singleUnitHealth;
      } else {
        unit.tailUnitHp! += healValueTail;
      }
    }

    unit.addUnitsCount(unitsToRevive);

    return {
      revivedUnitsCount: unitsToRevive,
      totalHealedHp: healValue,
    };
  }
}
