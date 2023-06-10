import { StructureDescription } from '../locations';

interface MapDimensions {
  widthInCells: number;
  heightInCells: number;
  cellSize: number;
}

export const CELL_SIZE = 86;

export class LevelMap {
  public readonly structures: StructureDescription[];

  public readonly mapSize: MapDimensions;

  constructor(config: {
    mapDimensions: MapDimensions,
    structures: StructureDescription[],
  }) {
    this.mapSize = { ...config.mapDimensions };
    this.structures = config.structures;

  }
}
