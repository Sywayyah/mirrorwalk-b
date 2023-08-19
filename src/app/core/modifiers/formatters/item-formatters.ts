import { Modifiers, ModifiersModel } from '../modifiers';

export const numMod = (num: number) => `${num >= 0 ? '+' : '-'}${num}`;

export function plainNumMod(label: string): (num: number) => string {
  return (num) => `${num >= 0 ? '+' : '-'}${num} ${label}`;
};

function percentVal(label: string): (val: number) => string {
  return (val) => `${numMod(val)}% ${label}`;
}

export const modsFormatters: { [K in keyof Modifiers]: (val: ModifiersModel[K]) => string } = {
  playerBonusAttack: plainNumMod('Attack Rating'),
  playerBonusDefence: plainNumMod('Defence'),
  lifesteal: percentVal('Lifesteal'),

  resistAll: percentVal('All Resists'),
  resistFire: percentVal('Fire Resist'),
  resistCold: percentVal('Cold Resist'),
  resistLightning: percentVal('Lightning Resist'),
  resistPoison: percentVal('Poison Resist'),

  // Masteries
  specialtyNecromancy: plainNumMod('Necromancy'),
  specialtySpiritism: plainNumMod('Spiritism'),

  specialtyMysticism: plainNumMod('Mysticism'),
  specialtyMagic: plainNumMod('Magic'),

  specialtyColdMastery: plainNumMod('Cold Mastery'),
  specialtyFireMastery: plainNumMod('Fire Mastery'),
  specialtyLightningMastery: plainNumMod('Lightning Mastery'),
  specialtyPoisonMastery: plainNumMod('Poison Mastery'),

  specialtyCombatTactics: plainNumMod('Combat Tactics'),
  specialtyArchery: plainNumMod('Archery'),
  specialtyOffence: plainNumMod('Offensive Tactics'),

};
