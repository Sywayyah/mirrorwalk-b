export interface ConfigModel {
  logEvents: boolean;
  logGameObjects: boolean;
  logObjectsOnRightClick: boolean;

  showLocationsIds: boolean;

  enableHeroUnits: boolean;
  sandboxMode: boolean;
  scenarioEditorMode: boolean;

  gameSettings: boolean;

  // allows to control neutral AI
  allowNeutralAIControl: boolean;
}
