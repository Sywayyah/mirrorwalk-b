import { hasProp } from '../utils/common';
import { ModValueUpdater } from './mod-updater';
import { Modifiers, ModName, ModifiersModel } from './modifiers';

/**
 * This class represents a wrapper over object with Modifiers.
 *
 * Whenever you want to create modifiers, instance of this class
 * should be created. Can be used with ModsRefsGroup.
 */
export class ModsRef {
  private readonly mods: Modifiers;

  private readonly valuesUpdater: ModValueUpdater;

  private constructor(modifiers: Modifiers) {
    this.mods = modifiers;
    this.valuesUpdater = ModValueUpdater.fromObjectRef(this.mods);
  }

  static fromMods(this: void, mods?: Modifiers): ModsRef {
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
