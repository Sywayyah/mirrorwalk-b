import { ActionCard, ActionCardStack } from '../action-cards';
import { GameObject } from '../game-objects';
import { GarrisonsMap } from '../garrisons/types';
import { Hero } from '../heroes';
import { Resources, ResourcesModel } from '../resources';
import { UnitBaseType } from '../unit-types';

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
}

export class Player extends GameObject<PlayerCreationModel> {
  public static readonly categoryId: string = 'player';

  public color!: string;

  /* resources can be stored separately in theory. */
  public resources!: ResourcesModel;

  public type!: PlayerTypeEnum;

  public garrisons: GarrisonsMap = new Map();

  public hero!: Hero;

  public actionCards: ActionCardStack[] = [];

  create({ color, hero, resources, type }: PlayerCreationModel): void {
    this.color = color;
    this.resources = resources;
    this.type = type;
    this.hero = hero;

    this.hero.assignOwnerPlayer(this);
    this.hero.updateUnitsSpecialtyAndConditionalMods();
  }

  addActionCards(actionCard: ActionCard, count: number): void {
    const cardStack = this.actionCards.find((stack) => stack.card === actionCard);

    if (cardStack) {
      cardStack.count += count;
    } else {
      this.actionCards.push({
        card: actionCard, count
      });
    }
  }

}
