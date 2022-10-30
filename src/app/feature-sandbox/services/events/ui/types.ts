import { UnitGroupInstModel } from "src/app/core/model";
import { HoverTypeEnum } from "../../types";
import { props } from "../common";

export type PlayerHoversCardEvent = {
  hoverType: HoverTypeEnum;
  currentCard?: UnitGroupInstModel;
  hoveredCard?: UnitGroupInstModel;
}

export type PlayerClicksEnemyGroupEvent = props<'attackedGroup' | 'attackingGroup' | 'attackingPlayer'>;

export type PlayerClicksAllyGroupEvent = props<'unitGroup'>;
