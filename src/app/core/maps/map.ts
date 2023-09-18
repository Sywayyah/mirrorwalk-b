import { StructureDescription } from "../structures";

interface MapDimensions {
  widthInCells: number;
  heightInCells: number;
  cellSize: number;
}

export class LevelMap {
  public readonly structures: StructureDescription[];

  public readonly mapSize: MapDimensions;

  public readonly startingLocId: string;

  constructor(config: {
    mapDimensions: MapDimensions,
    structures: StructureDescription[],
    startLocId: string;
  }) {
    this.mapSize = { ...config.mapDimensions };
    this.structures = config.structures;
    this.startingLocId = config.startLocId;
  }
}
