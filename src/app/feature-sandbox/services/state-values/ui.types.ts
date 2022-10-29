import { UnitGroupInstModel } from "src/app/core/model/main.model";
import { HoverTypeEnum } from "../types";

export type PlayerHoversCardEvent = {
  hoverType: HoverTypeEnum;
  currentCard?: UnitGroupInstModel;
  hoveredCard?: UnitGroupInstModel;
}
