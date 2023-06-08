import { getEntries } from '../utils/common';
import { ModValueUpdater } from './mod-updater';
import { BoolModNames, ModName, Modifiers, ModifiersModel, NumModNames } from './modifiers';
import { ModsRef } from './mods-ref';

/* New modifiers system */
// todo:
//  - maybe introduce interfaces
//  - should values get updated dynamically? ideally not.
//  - ideally, mods shouldn't change dynamically.
//  - maybe some updated$ stream can be introduced to the group
//  - combining groups now has basic implementation.

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

  static withRefs(modRefs: ModsRef[]): ModsRefsGroup {
    const newGroup = new ModsRefsGroup();

    modRefs.forEach(modRef => newGroup.addModsRef(modRef));

    return newGroup;
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
