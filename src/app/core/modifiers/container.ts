import { KeysMatching } from '../utils';
import { getEntries } from '../utils/common';
import { Modifiers, ModifiersModel } from './modifiers';

/*
  Attention: this doesn't seem to fit the modifiers idea completely, so
  this is a V1 attempt.

  I don't feel like having recursive data structure is good.

  But also, it doesn't seem to fit the entire idea. One class doens't seem
  to be sufficient, way to many unrelated responsibilities.

  And also, abstract class doesn't seem to be suitable for all this.

  This is why I'm moving to V2, the idea with ModsRef and ModsRefGroup
*/


abstract class AbstractModifiers {
  abstract getModValue<K extends keyof ModifiersModel>(modName: K): ModifiersModel[K] | null;
  abstract getModValues<K extends keyof ModifiersModel>(modName: K): (ModifiersModel[K][]) | [];
  abstract addModsRef(mods: AbstractModifiers): void;
  abstract removeModsByRef(mods: AbstractModifiers): void;
  abstract fullRecalc(): void;
  abstract getAllMods(): Modifiers;
}

// Think about this: Could it be better if mods where just managed by composition?
// What if I can just attach mods to certain things via maps?

// Recursive structure like modifiers group might seem a little intimidating.
// It might seem as something that is a little hard to manage, develop, etc.

// Or, in theory, it can be combined. Some service might be responsible for
// storing modifiers, but it will attach these ModGroups to entities, so
// it can be pretty ok.


class ModifiersGroup extends AbstractModifiers {
  // also, might be something like 'root' mods, a.k.a. own mods.
  // And static method to create instances
  // And also.. might be some kind of self-registering in parents.
  // When something is changing in child, it reflects on parent container

  // along with creating from passed mods, there might also be some
  // options, like 'no-stacking'.

  // Implement own mods somehow.
  private ownMods!: Modifiers;

  private readonly modGroups: AbstractModifiers[] = [];

  // Holds all values calculated
  private readonly cachedModValues: Modifiers = {};

  private constructor(ownMods: Modifiers) {
    super();
    this.ownMods = ownMods;
  }

  static createFromMods(ownMods?: Modifiers): ModifiersGroup {
    return new ModifiersGroup(ownMods || {});
  }

  getModValue<K extends keyof ModifiersModel>(modName: K): ModifiersModel[K] | null {
    return this.cachedModValues[modName] || null;
  }

  // For now, getting all values is recalculating, this might be alright to have it like this.
  // for now, no deep lookup
  getModValues<K extends keyof ModifiersModel>(modName: K): (ModifiersModel[K][]) | [] {
    return this.modGroups
      .filter(mod => !!mod.getModValue(modName))
      .map((mod) => mod.getModValue(modName) as ModifiersModel[K]);
  }

  // only self, no deep recalc.
  fullRecalc(): void {
    for (const modName in this.cachedModValues) {
      delete this.cachedModValues[modName as keyof Modifiers];
    }

    this.modGroups.forEach((mod) => {
      this.addModsRef(mod);
    });
  }

  addModsRef(mods: AbstractModifiers): void {
    this.modGroups.push(mods);
    this.processAddedMods(mods);
  }

  removeModsByRef(modsRef: AbstractModifiers): void {
    const modIndex = this.modGroups.indexOf(modsRef);

    this.modGroups.splice(modIndex, 1);

    this.processRemovedMods(modsRef);
  }

  getAllMods(): Modifiers {
    return this.cachedModValues;
  }

  private processAddedMods(mods: AbstractModifiers): void {
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

  private processRemovedMods(mods: AbstractModifiers): void {
    const modsMap = mods.getAllMods();

    getEntries(modsMap).forEach(([modName, modValue]) => {
      if (typeof modValue === 'number') {
        this.removeNumericModValue(modName, modValue);
        return;
      }

      if (typeof modValue === 'boolean') {
        this.removeBooleanStatusModValue(modName, modValue);
      }
    });
  }

  // Most numeric values are simply stacking additively.
  private addNumericModValue(modifierProp: KeysMatching<ModifiersModel, number>, val: number): void {
    const finalValue = this.cachedModValues[modifierProp];

    this.cachedModValues[modifierProp] = typeof finalValue === 'undefined' ? val : finalValue + val;
  }

  private removeNumericModValue(modifierProp: KeysMatching<ModifiersModel, number>, val: number): void {
    const finalValue = this.cachedModValues[modifierProp];

    this.cachedModValues[modifierProp] = typeof finalValue === 'undefined' ? val : finalValue - val;
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

  private removeBooleanStatusModValue(modifierProp: KeysMatching<ModifiersModel, boolean>, val: boolean): void {
    const statusModValues = this.getModValues(modifierProp) as boolean[];

    if (statusModValues.includes(true)) {
      return;
    }

    this.cachedModValues[modifierProp] = false;
  }
}

const a: AbstractModifiers = ModifiersGroup.createFromMods({ amplifiedTakenMagicDamagePercent: 0 });

const b = a.getModValue('amplifiedTakenMagicDamagePercent');
const c = a.getModValue('counterattacks');
const d = a.getModValue('isGhost');
const e = a.getAllMods();
const f = a.getModValues('attackConditionalModifiers');
