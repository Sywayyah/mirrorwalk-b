import { KeysMatching } from './container';
import { ModName, Modifiers, ModifiersModel } from './modifiers';

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
      this.addNumericModValue(modName as KeysMatching<ModifiersModel, number>, val);
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

  private addNumericModValue(modifierProp: KeysMatching<ModifiersModel, number>, val: number): void {
    const finalValue = this.modsObject[modifierProp];

    this.modsObject[modifierProp] = typeof finalValue === 'undefined'
      // if value wasn't defined yet, replace
      ? val
      // else, combine and round to 2 digits after dot
      : Number((finalValue + val).toFixed(2));
  }
}

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

  clearMod(modName: ModName): void {
    this.valuesUpdater.clearValue(modName);
  }
}

export class ModsRefsGroup {
  private readonly modsRefs: ModsRef[] = [];

  private readonly cachedModValues: Modifiers = {};

  private readonly valueUpdater: ModValueUpdater;

  private constructor() {
    this.valueUpdater = ModValueUpdater.fromObject(this.cachedModValues);
  }

  /**
   * @returns New empty group instance
   */
  static empty(): ModsRefsGroup {
    return new ModsRefsGroup();
  }

  addModsRef(modRef: ModsRef): void {
    this.modsRefs.push(modRef);
  }

  removeModsRef(modsRef: ModsRef): void {
    const modsRefIndex = this.modsRefs.indexOf(modsRef);

    this.modsRefs.splice(modsRefIndex, 1);
  }

  getAllRefs(): ModsRef[] {
    return this.modsRefs;
  }
}
