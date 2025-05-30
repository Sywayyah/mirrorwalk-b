export interface ConfigModel {
  logEvents: boolean;
  logGameObjects: boolean;
  logObjectsOnRightClick: boolean;

  showLocationsIds: boolean;

  enableHeroUnits: boolean;

  allowNeutralAIControlByDefault: boolean;
  // control features availability for deployments
  features: Feature[];
}

export enum Feature {
  SandboxMode,
  ScenarioEditor,
  NewGameSettings,
  NewTownSystem,
  MultiplayerServer,

  TECHBanditCampVariety,

}
