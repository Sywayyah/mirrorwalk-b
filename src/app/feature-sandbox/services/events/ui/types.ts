import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { props } from '../common';

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
