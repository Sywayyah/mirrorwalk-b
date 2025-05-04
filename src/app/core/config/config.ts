import { ConfigModel } from './types';

// config for local development
export const CONFIG: ConfigModel = {
  logEvents: false,
  logGameObjects: true,
  logObjectsOnRightClick: true,

  showLocationsIds: false,

  // can become a game-setting
  enableHeroUnits: true,

  gameSettings: true,
  allowNeutralAIControl: false,
} as const;
