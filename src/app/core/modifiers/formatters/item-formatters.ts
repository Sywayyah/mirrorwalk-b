import { Modifiers, ModifiersModel } from '../modifiers';

export const numMod = (num: number) => `${num >= 0 ? '+' : '-'}${num}`;

export const modsFormatters: { [K in keyof Modifiers]: (val: ModifiersModel[K]) => string } = {
  playerBonusAttack: val => `${numMod(val)} Attack Rating`,
  playerBonusDefence: val => `${numMod(val)} Defence`,
  resistAll: val => `${numMod(val)}% All Resists`,
  lifesteal: val => `${numMod(val)}% Lifesteal`,
};
