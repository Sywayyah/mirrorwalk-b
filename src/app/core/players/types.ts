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

  public get unitGroups() {
    return this._unitGroups;
  }

  private _unitGroups: UnitGroup[] = [];

  create({ color, hero, resources, type, unitGroups }: PlayerCreationModel): void {
    this.color = color;
    this.resources = resources;
    this.type = type;
    this.hero = hero;
    this.setUnitGroups(unitGroups);

    this.hero.assignOwnerPlayer(this);
    this.hero.updateUnitsSpecialtyMods();
  }

  addUnitGroup(unitGroup: UnitGroup): void {
    this._unitGroups.push(unitGroup);
    this.updateUnitGroup(unitGroup);
  }

  setUnitGroups(unitGroups: UnitGroup[]): void {
    this._unitGroups = unitGroups;
    this._unitGroups.forEach((unitGroup) => this.updateUnitGroup(unitGroup));
  }

  removeUnitGroup(unitGroup: UnitGroup): void {
    // todo: unassign hero 
    CommonUtils.removeItem(this.unitGroups, unitGroup);
  }

  private updateUnitGroup(unitGroup: UnitGroup): void {
    unitGroup.assignOwnerPlayer(this);
    this.hero.updateUnitSpecialtyMods(unitGroup);
  }
}
