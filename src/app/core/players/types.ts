import { signal } from '@angular/core';
import { ActionCard, ActionCardStack } from '../action-cards';
import { GameObject } from '../game-objects';
import { GarrisonsMap } from '../garrisons/types';
import { Hero } from '../heroes';
import { ResourcesModel } from '../resources';
import { WeeklyActivity } from '../specialties';
import { SignalArrUtils } from '../utils/signals';

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

  // maybe should be on hero level, also probably need category
  public activities = signal<WeeklyActivity[]>([]);

  create({ color, hero, resources, type }: PlayerCreationModel): void {
    this.color = color;
    this.resources = resources;
    this.type = type;
    this.hero = hero;

    this.hero.assignOwnerPlayer(this);
    this.hero.updateUnitsSpecialtyAndConditionalMods();
  }

  addWeeklyActivity(activity: WeeklyActivity): void {
    this.activities.update(SignalArrUtils.addItem(activity));
  }

  removeWeeklyActivity(activity: WeeklyActivity): void {
    this.activities.update(SignalArrUtils.removeItem(activity));
  }

  addActionCards(actionCard: ActionCard, count: number): void {
    const cardStack = this.actionCards.find(
      (stack) => stack.card === actionCard,
    );

    if (cardStack) {
      cardStack.count += count;
    } else {
      this.actionCards.push({
        card: actionCard,
        count,
      });
    }
  }
}
