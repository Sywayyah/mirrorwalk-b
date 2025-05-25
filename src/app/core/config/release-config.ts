import { ConfigModel, Feature } from './types';

// config for release
export const CONFIG: ConfigModel = {
  logEvents: false,
  logGameObjects: true,
  logObjectsOnRightClick: true,

  showLocationsIds: false,

  enableHeroUnits: true,

  allowNeutralAIControlByDefault: false,

  features: [Feature.TECHBanditCampVariety, Feature.NewGameSettings, Feature.ScenarioEditor],
} as const;
