
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

export type Masteries = {
  [masteryProp in `specialty${Capitalize<keyof SpeciatiesModel>}`]: number;
};
