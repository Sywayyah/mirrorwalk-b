import { Modifiers, ModifiersModel } from '../modifiers';

export const numMod = (num: number) => `${num >= 0 ? '+' : '-'}${num}`;

function percentVal(label: string, val: number): string {
  return `${numMod(val)} ${label}`
}
export const modsFormatters: { [K in keyof Modifiers]: (val: ModifiersModel[K]) => string } = {
  playerBonusAttack: val => `${numMod(val)} Attack Rating`,
  playerBonusDefence: val => `${numMod(val)} Defence`,
  resistAll: val => percentVal('All Resists', val),
  lifesteal: val => percentVal('Lifesteal', val),
  resistFire: val => percentVal('Fire Resist', val),
  resistCold: val => percentVal('Cold Resist', val),
  resistLightning: val => percentVal('Lightning Resist', val),
  resistPoison: val => percentVal('Poison Resist', val),
};
