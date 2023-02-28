import { Injectable } from '@angular/core';
import { HealingInfo } from 'src/app/core/api/combat-api';
import { PlayerInstanceModel } from 'src/app/core/players';
import { CommonUtils, GenerationModel, Modifiers, ModifiersModel, UnitBase, UnitGroupInstModel, UnitGroupModel, UnitsUtils } from 'src/app/core/unit-types';
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
  ) { }
  /* todo: unify it */
  /*  todo: figure out diff between UnitGroupModel and Inst */

  public createUnitGroup(
    type: UnitBase,
    options: { count: number },
    player: PlayerInstanceModel,
  ): UnitGroupModel {
    const unitGroup: UnitGroupModel = {
      count: options.count,
      type: type,
      ownerPlayerRef: player,
      turnsLeft: type.defaultTurnsPerRound,
      fightInfo: {
        initialCount: options.count,
        isAlive: true,
      },
    };

    this.updateUnitGroupSpells(unitGroup);

    return unitGroup;
  }

  public createUnitGroupFromGenModel(
    genModel: GenerationModel,
  ): UnitGroupModel[] {
    return UnitsUtils
      .createRandomArmy(genModel)
      .map(unitGroup => this.updateUnitGroupSpells(unitGroup));
  }

  public createUnitGroupFromGenModelForPlayer(
    genModel: GenerationModel,
    player: PlayerInstanceModel,
  ): UnitGroupModel[] {
    return UnitsUtils
      .createRandomArmyForPlayer(genModel, player)
      .map(unitGroup => this.updateUnitGroupSpells(unitGroup));
  }

  public addModifierToUnitGroup(target: UnitGroupInstModel, modifiers: Modifiers) {
    target.modifiers = [...target.modifiers, modifiers];
  }

  public removeModifiers(target: UnitGroupInstModel, modifiers: Modifiers): void {
    CommonUtils.removeItem(target.modifiers, modifiers);
  }

  public clearUnitModifiers(target: UnitGroupInstModel): void {
    target.modifiers = [];
  }

  public getUnitGroupSpeed(unitGroup: UnitGroupInstModel): number {
    const speedBonusFromMods = unitGroup.modifiers
      .filter(mod => mod.unitGroupSpeedBonus)
      .reduce((speedBonusSum, nextMod) => speedBonusSum + (nextMod.unitGroupSpeedBonus ?? 0), 0);

    return unitGroup.type.baseStats.speed + speedBonusFromMods;
  }

  /*
   This might be theoretically split into a data function and executing function,
     in the same manner as damage functions.
   */
  public healUnit(unit: UnitGroupInstModel, healValue: number): HealingInfo {
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
      unit.count = initialUnitsCount;

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

    unit.count += unitsToRevive;

    return {
      revivedUnitsCount: unitsToRevive,
      totalHealedHp: healValue,
    };
  }

  public calcUiMods(target: UnitGroupInstModel): UIModsModel {
    return {
      speed: this.getNumericModifier(target, 'unitGroupSpeedBonus'),
      attack: this.getNumericModifier(target, 'unitGroupBonusAttack'),
    };
  }

  private getNumericModifier(target: UnitGroupInstModel, modifierProp: KeysMatching<ModifiersModel, number>): number {
    return target.modifiers.filter(mod => mod[modifierProp]).reduce((sum, next) => sum + (next[modifierProp] ?? 0), 0);
  }

  private updateUnitGroupSpells(unitGroup: UnitGroupModel): UnitGroupModel {
    const unitGroupDefaultSpells = unitGroup.type.defaultSpells;

    const unitGroupInst = unitGroup as UnitGroupInstModel;

    /* Init modifiers with empty list */
    unitGroupInst.modifiers = [];

    if (unitGroupDefaultSpells) {
      unitGroupInst.spells = unitGroupDefaultSpells.map(spell => this.spells.createSpellInstance(spell));
    } else {
      unitGroupInst.spells = [];
    }

    return unitGroup;
  }
}
