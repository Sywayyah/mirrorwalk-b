import { signal } from '@angular/core';
import { ActionCard, ActionCardStack } from '../action-cards';
import { ActionCardId, ItemId, resolveEntity, SpellId } from '../entities';
import { GameObject } from '../game-objects';
import { GarrisonsMap } from '../garrisons/types';
import { Hero } from '../heroes';
import { ItemBaseType } from '../items';
import { CostableCountItem, CostableItem, ResourcesModel, SignalCostableCountItem } from '../resources';
import { WeeklyActivity } from '../specialties';
import { SpellBaseType } from '../spells';
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

export interface HallsOfFateConfig {
  id: string;
  spells: CostableItem<SpellBaseType>[];
  actionCards: SignalCostableCountItem<ActionCard>[];
  items: ItemBaseType[];
}

export class Player extends GameObject<PlayerCreationModel> {
  public static readonly categoryId: string = 'player';

  public color!: string;

  /* resources can be stored separately in theory. */
  public resources!: ResourcesModel;

  public type!: PlayerTypeEnum;

  public readonly garrisons: GarrisonsMap = new Map();

  public readonly hallsOfFateConfig: HallsOfFateConfig[] = [];

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

  addHallsOfFateConfig(config: {
    id: string;
    items: ItemId[];
    spells: CostableItem<SpellId>[];
    actionCards: CostableCountItem<ActionCardId>[];
  }): void {
    this.hallsOfFateConfig.push({
      id: config.id,
      actionCards: config.actionCards.map((card) => ({
        cost: card.cost,
        count: signal(card.count),
        item: resolveEntity(card.item),
      })),
      items: config.items.map((itemId) => resolveEntity(itemId)),
      spells: config.spells.map((card) => ({
        cost: card.cost,
        item: resolveEntity(card.item),
      })),
    });
  }
  addWeeklyActivity(activity: WeeklyActivity): void {
    this.activities.update(SignalArrUtils.addItem(activity));
  }

  removeWeeklyActivity(activity: WeeklyActivity): void {
    this.activities.update(SignalArrUtils.removeItem(activity));
  }

  addActionCards(actionCard: ActionCard, count: number): void {
    const cardStack = this.actionCards.find((stack) => stack.card === actionCard);

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
