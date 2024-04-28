import { Resources } from "../resources";
import { UnitBaseType } from "../unit-types";

export type GarrisonHirableGroup = {
  type: UnitBaseType;
  cost: Resources;
  count: number;
};

export type GarrisonModel = {
  name: string;
  groups: GarrisonHirableGroup[];
};

export type GarrisonsMap = Map<string, GarrisonModel>;
