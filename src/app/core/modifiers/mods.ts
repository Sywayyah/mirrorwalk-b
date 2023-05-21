import { getEntries, hasProp } from '../utils/common';
import { BoolModNames, ModName, Modifiers, ModifiersModel, NumModNames } from './modifiers';

/* New modifiers system */
// todo:
//  - maybe introduce interfaces
//  - should values get updated dynamically? ideally not.
//  - ideally, mods shouldn't change dynamically.
//  - maybe some updated$ stream can be introduced to the group
//  - combining groups now has basic implementation.


/**
 * This class controls how different modifiers should stack upon each other,
 * how they should be cleared, etc.
 *
 * Most numeric modifiers are stacking additively.
 * Most boolean values represent statuses.
 */
class ModValueUpdater {
  private readonly modsObject: Modifiers;

  private constructor(mods: Modifiers) {
    this.modsObject = mods;
  }

  static fromObject(mods: Modifiers): ModValueUpdater {
    return new ModValueUpdater(mods);
  }

  /**
   * Replaces mod value with given.
   *
   * @param modName name of the mod
   * @param val new value
   */
  setValue<K extends ModName>(modName: K, val: ModifiersModel[K]): void {
    this.modsObject[modName] = val;
  }

  /**
   * For numeric values, pass positive values to add, pass negative values to subtract.
   * For boolean values, passed value will replace existing (same as `setValue`).
   *
   * Values of any other type will act same as `setValue`.
   *
   * @param modName name of the mod to update
   * @param val value to adjust
   * */
  addValue<K extends ModName>(modName: K, val: ModifiersModel[K]): void {
    if (typeof val === 'number') {
      // handle most of numeric values additively
      this.addNumericModValue(modName as NumModNames, val);
      return;
    }

    if (typeof val === 'boolean') {
      // just replace value in case of boolean
      this.setValue(modName, val);
      return;
    }

    // in other cases, also replace existing value for now.
    this.setValue(modName, val);
  }

  /**
   * Completely erases mod name and value.
   *
   * @param modName mod name to clear
   */
  clearValue(modName: ModName): void {
    delete this.modsObject[modName];
  }

  private addNumericModValue(modifierProp: NumModNames, val: number): void {
    const finalValue = this.modsObject[modifierProp];

    this.modsObject[modifierProp] = typeof finalValue === 'undefined'
      // if value wasn't defined yet, replace
      ? val
      // else, combine and round to 2 digits after dot
      : Number((finalValue + val).toFixed(2));
  }
}

/**
 * This class represents a wrapper over object with Modifiers.
 *
 * Whenever you want to create modifiers, instance of this class
 * should be created. Can be used with ModsRefsGroup.
 */
export class ModsRef {
  private readonly mods: Modifiers;

  private readonly valuesUpdater: ModValueUpdater;

  private constructor(
    modifiers: Modifiers
  ) {
    this.mods = modifiers;
    this.valuesUpdater = ModValueUpdater.fromObject(this.mods);
  }

  static fromMods(mods?: Modifiers): ModsRef {
    return new ModsRef(mods || {});
  }

  getModValue<K extends ModName>(modName: K): ModifiersModel[K] | null {
    return this.mods[modName] || null;
  }

  setModValue<K extends ModName>(modName: K, val: ModifiersModel[K]): void {
    this.valuesUpdater.setValue(modName, val);
  }

  addModValue<K extends ModName>(modName: K, val: ModifiersModel[K]): void {
    this.valuesUpdater.addValue(modName, val);
  }

  hasMod(modName: ModName): boolean {
    return hasProp(this.mods, modName);
  }

  clearMod(modName: ModName): void {
    this.valuesUpdater.clearValue(modName);
  }


  getMods(): Modifiers {
    return this.mods;
  }
}

/**
 * This class can aggregate multiple `ModsRef`, and retrieve combined mod values.
 * It also can combine values from other groups using `attachGroup` method.
 * Use `detachGroup` to detach attached groups.
 *
 * The way attaching works is by sharing all of `ModsRef`s with parent groups.
 */
export class ModsRefsGroup {
  private readonly modsRefs: ModsRef[] = [];

  private readonly cachedModValues: Modifiers = {};

  private readonly valueUpdater: ModValueUpdater;

  private readonly subGroups: Set<ModsRefsGroup> = new Set();

  private readonly parentGroups: Set<ModsRefsGroup> = new Set();

  private constructor() {
    this.valueUpdater = ModValueUpdater.fromObject(this.cachedModValues);
  }

  /**
   * @returns New empty group instance
   */
  static empty(): ModsRefsGroup {
    return new ModsRefsGroup();
  }

  getCalcNumModValue<K extends NumModNames>(modName: K): number | null {
    const refsWithNumericMod = this.modsRefs.filter(modsRef => modsRef.hasMod(modName));

    if (!refsWithNumericMod.length) {
      return null;
    }

    return refsWithNumericMod.reduce((acc, next) => acc + (next.getModValue(modName) as number), 0);
  }

  getCalcBoolNumModValue<K extends BoolModNames>(modName: K): boolean | null {
    const refsWithBoolMod = this.modsRefs.filter(modsRef => modsRef.hasMod(modName));

    if (!refsWithBoolMod.length) {
      return null;
    }

    return refsWithBoolMod.some(modsRef => modsRef.getModValue(modName));
  }

  addModsRef(modsRef: ModsRef): void {
    this.modsRefs.push(modsRef);
    this.processModsRef(modsRef);
    this.parentGroups.forEach((parentGroup) => parentGroup.addModsRef(modsRef));
  }

  removeModsRef(modsRef: ModsRef): void {
    const modsRefIndex = this.modsRefs.indexOf(modsRef);

    this.modsRefs.splice(modsRefIndex, 1);

    this.processModsRef(modsRef, true);
    this.parentGroups.forEach((parentGroup) => parentGroup.removeModsRef(modsRef));
  }

  getAllRefs(): ModsRef[] {
    return this.modsRefs;
  }

  getModValue<K extends ModName>(modName: K): ModifiersModel[K] | null {
    return this.cachedModValues[modName] || null;
  }

  getAllModValues<K extends keyof ModifiersModel>(modName: K): (ModifiersModel[K][]) | [] {
    return this.modsRefs
      .filter(mod => mod.hasMod(modName))
      .map((mod) => mod.getModValue(modName) as ModifiersModel[K]);
  }

  attachGroup(modsRefGroup: ModsRefsGroup): void {
    this.subGroups.add(modsRefGroup);
    modsRefGroup.parentGroups.add(this);
    modsRefGroup.getAllRefs().forEach(modRef => this.addModsRef(modRef));
  }

  detachGroup(modsRefGroup: ModsRefsGroup): void {
    this.subGroups.delete(modsRefGroup);
    modsRefGroup.parentGroups.delete(this);
    modsRefGroup.getAllRefs().forEach(modRef => this.removeModsRef(modRef));
  }

  private processModsRef(modsRef: ModsRef, removing?: boolean): void {
    getEntries(modsRef.getMods()).forEach(([modName, modValue]) => {
      // most numeric values are added additively
      if (typeof modValue === 'number') {
        this.valueUpdater.addValue(modName, removing ? -modValue : modValue);
        return;
      }

      // most boolean values are statuses
      if (typeof modValue === 'boolean') {
        if (!removing) {
          if (!this.cachedModValues[modName] && modValue) {
            this.cachedModValues[modName] = true;
          }
        } else {
          this.cachedModValues[modName] = this.getCalcBoolNumModValue(modName) || undefined;
        }
      }
    });
  }
}
