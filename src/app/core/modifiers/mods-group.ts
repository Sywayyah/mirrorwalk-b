import { BehaviorSubject, Observable } from 'rxjs';
import { CommonUtils } from '../utils';
import { getEntries } from '../utils/common';
import { ModValueUpdater } from './mod-updater';
import { BoolModNames, ModName, Modifiers, ModifiersModel, NumModNames } from './modifiers';
import { ModsRef } from './mods-ref';

/* New modifiers system */
// todo:
//  - maybe introduce interfaces
//  - should values get updated dynamically? ideally not.
//    - instead, value should be detached, updated, and reattached
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
// maybe add named refs for optimization/smth
export class ModsRefsGroup {
  private readonly modsRefs: ModsRef[] = [];

  private readonly cachedModValues: Modifiers = {};

  private readonly valueUpdater: ModValueUpdater;

  private readonly childGroups: Set<ModsRefsGroup> = new Set();

  private readonly parentGroups: Set<ModsRefsGroup> = new Set();
  private readonly namedParentGroupsMap: Map<string, ModsRefsGroup> = new Map();

  private readonly modValuesChange$ = new BehaviorSubject<Modifiers>({});

  private constructor() {
    this.valueUpdater = ModValueUpdater.fromObjectRef(this.cachedModValues);
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

  getCalcNumModValueOrZero<K extends NumModNames>(modName: K): number {
    return this.getCalcNumModValue(modName) ?? 0;
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
    this.childGroups.forEach((parentGroup) => parentGroup.addModsRef(modsRef));
    this.emitModValueChange();
  }

  /* Consider using removeRefByModInstance over removeModsRef with conditional modifiers, since for now they don't return ModsRef. */
  removeModsRef(modsRef: ModsRef): void {
    CommonUtils.removeItem(this.modsRefs, modsRef);

    this.processModsRef(modsRef, true);
    this.childGroups.forEach((childGroup) => childGroup.removeModsRef(modsRef));
    this.emitModValueChange();
  }

  getMods(): Modifiers {
    return this.cachedModValues;
  }

  clearOwnModRefs(): void {
    [...this.getAllRefs()].forEach(modRef => this.removeModsRef(modRef));
    this.emitModValueChange();
  }

  getAllRefs(): ModsRef[] {
    return this.modsRefs;
  }

  /* Recommended over removeModsRef, since conditional modifiers don't give ModsRef. */
  removeRefByModInstance(mods: Modifiers): void {
    const modsRef = this.modsRefs.find(modRef => modRef.getMods() === mods);

    if (modsRef) {
      this.removeModsRef(modsRef);
    }
  }

  getModValue<K extends ModName>(modName: K): ModifiersModel[K] | null {
    return this.cachedModValues[modName] || null;
  }

  getAllModValues<K extends keyof ModifiersModel>(modName: K): (ModifiersModel[K][]) | [] {
    return this.modsRefs
      .filter(mod => mod.hasMod(modName))
      .map((mod) => mod.getModValue(modName) as ModifiersModel[K]);
  }

  attachNamedParentGroup(name: string, parentGroup: ModsRefsGroup): void {
    if (this.namedParentGroupsMap.has(name)) {
      console.warn(`ModGroup: reattaching '${name}' parent mod group, child group:`, this);
      this.detachNamedParentGroup(name);
    }

    this.attachParentGroup(parentGroup);
    this.namedParentGroupsMap.set(name, parentGroup);
  }

  detachNamedParentGroup(name: string): void {
    const parentModRefsGroup = this.namedParentGroupsMap.get(name);

    if (parentModRefsGroup) {
      this.detachParentGroup(parentModRefsGroup);
      this.namedParentGroupsMap.delete(name);
    }
  }

  getNamedGroup(name: string): ModsRefsGroup | undefined {
    return this.namedParentGroupsMap.get(name);
  }

  onValueChanges(): Observable<Modifiers> {
    return this.modValuesChange$;
  }

  attachParentGroup(parentGroup: ModsRefsGroup): void {
    parentGroup.childGroups.add(this);
    this.parentGroups.add(parentGroup);
    parentGroup.getAllRefs().forEach(modRef => this.addModsRef(modRef));
    this.emitModValueChange();
  }

  detachParentGroup(parentGroup: ModsRefsGroup): void {
    this.parentGroups.delete(parentGroup);
    parentGroup.childGroups.delete(this);

    parentGroup.getAllRefs().forEach(modRef => this.removeModsRef(modRef));
    this.emitModValueChange();
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

  private emitModValueChange(): void {
    this.modValuesChange$.next(this.cachedModValues);
  }
}
