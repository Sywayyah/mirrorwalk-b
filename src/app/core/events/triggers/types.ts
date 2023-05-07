import { LevelMap } from '../../maps';

export interface GamePreparedEvent {
  map: LevelMap;
}

export enum DefaultGameModes {
  Normal = 'normal',
}
