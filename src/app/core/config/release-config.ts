import { ConfigModel } from './types';

// config for release
export const CONFIG: ConfigModel = {
  logEvents: false,
  logGameObjects: true,
  logObjectsOnRightClick: true,

  showLocationsIds: false,

  enableHeroUnits: true,

  gameSettings: true,
  allowNeutralAIControl: false,
} as const;
