export enum LossMode {
  // any losses during the fight are restored
  None = 'none',
  // losses during the fight are permanent
  Permanent = 'permanent',
}

export type GameSettings = {
  goldGain?: number;
  heroUnits?: boolean;
  neutralDamageFactor?: number;
  neutralHealthFactor?: number;
  experienceGain: number;
  neutralsWeeklyGrowth: number;
  neutralInitialCount: number;

  lossToNeutrals: LossMode;
  lossToPlayers: LossMode;
  lossToNeutralPlayers: LossMode;

  allowNeutralControl: boolean;
};
