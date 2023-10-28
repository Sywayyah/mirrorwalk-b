import { Modifiers, ModifiersModel } from '../modifiers';
import { Specialties } from '../specialties';

export const numMod = (num: number) => `${num >= 0 ? '+' : '-'}${num}`;

export function plainNumMod(label: string): (num: number) => string {
  return (num) => `${num >= 0 ? '+' : ''}${num} ${label}`;
};

function percentVal(label: string): (val: number) => string {
  return (val) => `${numMod(val)}% ${label}`;
}

export const specialtyLabels: Record<keyof Specialties, string> = {
  specialtyNecromancy: 'Necromancy',
  specialtySpiritism: 'Spiritism',

  specialtyMysticism: 'Mysticism',
  specialtyMagic: 'Magic',
  specialtyMagicRecovery: 'Restoration',

  specialtyColdMastery: 'Cold Mastery',
  specialtyFireMastery: 'Fire Mastery',
  specialtyLightningMastery: 'Lightning Mastery',
  specialtyPoisonMastery: 'Poison Mastery',

  specialtyCombatTactics: 'Combat Tactics',
  specialtyArchery: 'Archery',
  specialtyOffence: 'Offensive Tactics',
};

type ModFormatter<K extends keyof Modifiers> = (val: ModifiersModel[K]) => string;

export const modsFormatters: { [K in keyof Modifiers]: ModFormatter<K> } = {
  heroBonusAttack: plainNumMod('Attack Rating'),
  heroBonusDefence: plainNumMod('Defence'),
  heroMaxMana: plainNumMod('Max Mana'),

  lifesteal: percentVal('Lifesteal'),

  resistAll: percentVal('All Resists'),
  resistFire: percentVal('Fire Resist'),
  resistCold: percentVal('Cold Resist'),
  resistLightning: percentVal('Lightning Resist'),
  resistPoison: percentVal('Poison Resist'),
  cannotBeSlowed: () => 'Units Cannot be slowed',
};

export function formatMod(modName: keyof Modifiers, modValue: unknown): string {
  // if mod name is a specialty, use label
  if (modName in specialtyLabels) {
    return `+${modValue} to ${specialtyLabels[modName as keyof Specialties]}`;
  }

  // otherwise, use formatters, and return empty string if there is no formatter
  if (!(modName in modsFormatters)) {
    return '';
  }

  return (modsFormatters[modName] as ModFormatter<typeof modName>)(modValue as any);
}
