import { ConfigModel, Feature } from './types';

// config for release
export const CONFIG: ConfigModel = {
  logEvents: false,
  logGameObjects: true,
  logObjectsOnRightClick: true,

  showLocationsIds: false,

  enableHeroUnits: true,

  allowNeutralAIControl: false,

  features: [Feature.TECHBanditCampVariety, Feature.NewGameSettings],
} as const;
