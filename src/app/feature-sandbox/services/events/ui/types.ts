import { UnitGroupInstModel } from "src/app/core/model";
import { props } from "../common";

export enum HoverTypeEnum {
  EnemyCard,
  AllyCard,
  Unhover,
}

export type PlayerHoversCardEvent = {
  hoverType: HoverTypeEnum;
  currentCard?: UnitGroupInstModel;
  hoveredCard?: UnitGroupInstModel;
}

export type PlayerClicksEnemyGroupEvent = props<'attackedGroup' | 'attackingGroup' | 'attackingPlayer'>;

export type PlayerClicksAllyGroupEvent = props<'unitGroup'>;
