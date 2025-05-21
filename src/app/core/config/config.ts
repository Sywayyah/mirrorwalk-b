import { ConfigModel, Feature } from './types';

// config for local development
export const CONFIG: ConfigModel = {
  logEvents: false,
  logGameObjects: true,
  logObjectsOnRightClick: true,

  showLocationsIds: false,

  // can become a game-setting
  enableHeroUnits: true,

  allowNeutralAIControlByDefault: true,
  features: [
    Feature.NewGameSettings,
    Feature.SandboxMode,
    Feature.ScenarioEditor,
    Feature.NewTownSystem,
    Feature.TECHBanditCampVariety,
  ],
} as const;
