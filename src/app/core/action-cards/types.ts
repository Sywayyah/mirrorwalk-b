import { ActionCardId, Entity } from '../entities';
import { GameApi } from '../triggers';

export enum ActionCardTypes {
  Event,
  LocationAction,
  PlayerAction,
}

export interface ActionCard extends Entity {
  id: ActionCardId;
  title: string;
  type: ActionCardTypes;
  description: string;
  icon: string;
  bgColor?: string;
  iconColor?: string;
  borderColor?: string;

  actionPoints?: number;

  config?: {
    onUsedInstantly?(api: GameApi): void;
    onLocationTargeted?(api: GameApi): void;
  };
}

export interface ActionCardStack {
  card: ActionCard;
  count: number;
}

// todo: locations themselves will contain information about how much action points
//  they will require (or 1 if unspecified)
// player can have 3 action points at the beginning of each day
//  some cards are limited in use, but you will be able to extend it by visiting some locations
//
