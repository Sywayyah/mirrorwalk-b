import { ModName, Modifiers, ModifiersModel, NumModNames } from './modifiers';

/**
 * This class controls how values of different modifiers should stack upon each other,
 * how they should be cleared, etc.
 *
 * Most numeric modifiers are stacking additively.
 * Most boolean values represent statuses.
 */
export class ModValueUpdater {
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
