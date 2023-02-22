
// all here is experimental

import { StructureGeneratorModel, StructureModel } from '../structures';

export interface StructureDescription {
  x: number;
  y: number;
  icon: string;
  id: string;
  pathTo?: string;
  struct?: StructureGeneratorModel;
  isRoot?: boolean;
}

export interface ViewStructure {
  id: string;

  x: number;
  y: number;

  icon: string;

  isRoot?: boolean;

  pathTo?: string;

  visited?: boolean;
  parentStructs: Set<string>;

  structure?: StructureModel;

  svg?: {
    x: number;
    y: number;
    width: number;
    height: number;

    // origin x,y
    ox: number;
    oy: number;
    // target x,y
    tx: number;
    ty: number;
  }
}
