import { Hero } from '../heroes';
import { ResourcesModel } from '../resources';
import { UnitGroupModel } from '../unit-types';

export enum PlayerTypeEnum {
  Player = 'Player',
  AI = 'AI',
}

/* todo: seems reasonable to have heroes and players models as well */
export interface PlayerModel {
  color: string;

  /* resources can be stored separately in theory. */
  resources: ResourcesModel;

  type: PlayerTypeEnum;

  hero: Hero;

  unitGroups: UnitGroupModel[];
}

export interface PlayerInstanceModel extends PlayerModel {
  id: string;
}
