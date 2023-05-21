import { getEntries } from '../utils/common';
import { Modifiers, ModifiersModel } from './modifiers';

export type KeysMatching<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never
}[keyof T];

abstract class AbstractModifiers {
  abstract getModValue<K extends keyof ModifiersModel>(modName: K): ModifiersModel[K] | null;
  abstract getModValues<K extends keyof ModifiersModel>(modName: K): (ModifiersModel[K][]) | [];
  abstract addMods(mods: AbstractModifiers): void;
  abstract fullRecalc(): void;
  abstract getAllMods(): Modifiers;
}

// Think about this: Could it be better if mods where just managed by composition?
// What if I can just attach mods to certain things via maps?

class ModifiersGroup extends AbstractModifiers {
  // also, might be something like 'root' mods, a.k.a. own mods.
  // And static method to create instances
  // And also.. might be some kind of self-registering in parents.
  // When something is changing in child, it reflects on parent container

  // along with creating from passed mods, there might also be some
  // options, like 'no-stacking'.

  private readonly modGroups: AbstractModifiers[] = [];

  // Holds all values calculated
  private readonly cachedModValues: Modifiers = {};

  private constructor() {
    super();
  }

  static createFromMods(ownMods?: Modifiers): ModifiersGroup {
    return new ModifiersGroup();
  }

  getModValue<K extends keyof ModifiersModel>(modName: K): ModifiersModel[K] | null {
    return this.cachedModValues[modName] || null;
  }

  // For now, getting all values is recalculating, this might be alright to have it like this.
  getModValues<K extends keyof ModifiersModel>(modName: K): (ModifiersModel[K][]) | [] {
    // Actually.. this might be required to be handled recursively..
    return this.modGroups
      .filter(mod => !!mod.getModValue(modName))
      .map((mod) => mod.getModValue(modName) as ModifiersModel[K]);
  }

  fullRecalc(): void {
    for (const modName in this.cachedModValues) {
      delete this.cachedModValues[modName as keyof Modifiers];
    }

    this.modGroups.forEach((mod) => {
      this.addMods(mod);
    });
  }

  addMods(mods: AbstractModifiers): void {
    this.modGroups.push(mods);
    this.processMods(mods);
  }

  getAllMods(): Modifiers {
    return this.cachedModValues;
  }

  private processMods(mods: AbstractModifiers): void {
    const modsMap = mods.getAllMods();

    getEntries(modsMap).forEach(([modName, modValue]) => {
      // handle most of numeric values additively
      if (typeof modValue === 'number') {
        this.addNumericModValue(modName, modValue);
        return;
      }

      // most of boolean values are 'status' properties
      // if it's true once, then it's always true.
      if (typeof modValue === 'boolean') {
        this.setBooleanStatusModValue(modName, modValue);
      }

      // attackConditionalModifiers - unusual case, don't do anything about it yet
      // for such values, getModValues should be used, to get all values for this mod
    });
  }

  // Most numeric values are simply stacking additively.
  private addNumericModValue(modifierProp: KeysMatching<ModifiersModel, number>, val: number): void {
    const finalValue = this.cachedModValues[modifierProp];

    this.cachedModValues[modifierProp] = typeof finalValue === 'undefined' ? val : finalValue + val;
  }

  // Most of boolean values are representing some status.
  // If it is true once, then it's true always.
  private setBooleanStatusModValue(modifierProp: KeysMatching<ModifiersModel, boolean>, val: boolean): void {
    if (this.cachedModValues[modifierProp]) {
      return;
    }

    if (val) {
      this.cachedModValues[modifierProp] = val;
    }
  }
}

const a: AbstractModifiers = ModifiersGroup.createFromMods({ amplifiedTakenMagicDamage: 0 });

const b = a.getModValue('amplifiedTakenMagicDamage');
const c = a.getModValue('counterattacks');
const d = a.getModValue('isGhost');
const e = a.getAllMods();
const f = a.getModValues('attackConditionalModifiers');
