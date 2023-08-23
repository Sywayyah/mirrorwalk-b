import { getKeys } from '../utils/common';
import { Modifiers } from './modifiers';

export const specialtyKey = 'specialty';

export interface SpeciatiesModel {
  necromancy: number;
  spiritism: number;

  mysticism: number;
  magic: number;
  fireMastery: number;
  coldMastery: number;
  poisonMastery: number;
  lightningMastery: number;

  archery: number;
  combatTactics: number;
  offence: number;
}

export type Specialties = {
  [specialtyProp in `${typeof specialtyKey}${Capitalize<keyof SpeciatiesModel>}`]: number;
};

export function filterSpecialties(mods: Modifiers): Modifiers {
  const specialtyMods: Modifiers = {};

  for (const modName of getKeys(mods)) {
    if (modName.startsWith(specialtyKey)) {
      specialtyMods[modName] = mods[modName] as any;
    }
  }

  return specialtyMods;
}

/** Shallow comparison of mods objects */
export function areModsSame(modsA: Modifiers, modsB: Modifiers): boolean {
  const modsAKeys = getKeys(modsA);
  const modsBKeys = getKeys(modsB);

  return modsAKeys.length === modsBKeys.length && modsAKeys.every((keyA) => modsA[keyA] === modsB[keyA]);
}
