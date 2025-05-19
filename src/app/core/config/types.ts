export interface ConfigModel {
  logEvents: boolean;
  logGameObjects: boolean;
  logObjectsOnRightClick: boolean;

  showLocationsIds: boolean;

  enableHeroUnits: boolean;
  sandboxMode: boolean;

  gameSettings: boolean;

  // allows to control neutral AI
  allowNeutralAIControl: boolean;
}
