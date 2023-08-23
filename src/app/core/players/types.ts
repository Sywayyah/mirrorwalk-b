import { GameObject } from '../game-objects';
import { Hero } from '../heroes';
import { ResourcesModel } from '../resources';
import { UnitGroup } from '../unit-types';
import { CommonUtils } from '../utils';

export enum PlayerTypeEnum {
  Player = 'Player',
  AI = 'AI',
}

export enum PlayerState {
  /* player makes his move */
  Normal = 'normal',

  /* player targets a spell */
  SpellTargeting = 'spell-targeting',

  /* enemy now makes his turn, player waits */
  WaitsForTurn = 'waits-for-turn',
}

export interface PlayerCreationModel {
  color: string;

  resources: ResourcesModel;

  type: PlayerTypeEnum;

  hero: Hero;

  unitGroups: UnitGroup[];
}

export class Player extends GameObject<PlayerCreationModel> {
  public static readonly categoryId: string = 'player';

  public color!: string;

  /* resources can be stored separately in theory. */
  public resources!: ResourcesModel;

  public type!: PlayerTypeEnum;

  public hero!: Hero;

  public unitGroups!: UnitGroup[];

  create({ color, hero, resources, type, unitGroups }: PlayerCreationModel): void {
    this.color = color;
    this.resources = resources;
    this.type = type;
    this.unitGroups = unitGroups;
    this.hero = hero;

    this.hero.assignOwnerPlayer(this);
    this.hero.updateUnitsSpecialtyMods();
  }

  addUnitGroup(unitGroup: UnitGroup): void {
    this.unitGroups.push(unitGroup);
    this.hero.updateUnitSpecialtyMods(unitGroup);
  }

  removeUnitGroup(unitGroup: UnitGroup): void {
    CommonUtils.removeItem(this.unitGroups, unitGroup);
  }
}
