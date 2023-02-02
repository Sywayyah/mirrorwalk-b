import { Injectable } from '@angular/core';
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

  public healUnit(unit: UnitGroupInstModel, healValue: number): { healedUnitsCount: number } {
    const singleUnitHealth = unit.type.baseStats.health;

    const healedUnitsCount = Math.floor(healValue / singleUnitHealth);

    let fullHealedUnitsCount = healedUnitsCount * singleUnitHealth;

    let healValueTail = healValue - fullHealedUnitsCount;

    if (unit.tailUnitHp) {
      const combinedTails = healValueTail + unit.tailUnitHp;

      if (combinedTails > singleUnitHealth) {
        fullHealedUnitsCount + 1;
      }

      healValueTail = combinedTails - singleUnitHealth;
    }

    unit.count += fullHealedUnitsCount;
    unit.tailUnitHp = healValueTail;

    const initialCount = unit.fightInfo.initialCount;

    if (unit.count >= initialCount) {
      unit.count = initialCount;
      unit.tailUnitHp = singleUnitHealth;
    }

    if (!unit.fightInfo.isAlive) {
      unit.fightInfo.isAlive = true;
    }

    return {
      healedUnitsCount: fullHealedUnitsCount,
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
