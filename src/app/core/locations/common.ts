import { StructureGeneratorModel, StructureModel } from '../structures';
import { BanditCamp, BeaconOfTheUndead, GraveyardStructure, MountainNestStructure } from '../structures/common';

/* Think more here, customizable locations, more location types (resource piles, single guards, etc.) */

export interface StructureDescription {
  x: number;
  y: number;
  icon: string;
  id: string;
  pathTo?: string;
  struct?: StructureGeneratorModel;
}

export interface ViewStructure {
  id: string;

  x: number;
  y: number;

  icon: string;

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

const brBranch: StructureDescription[] = [
  {
    id: '2',
    x: 60,
    y: 30,
    icon: 'tombstone',
    pathTo: '1',
    struct: GraveyardStructure,
  },
  {
    id: '5',
    x: 120,
    y: 40,
    icon: 'sword',
    pathTo: '2',

    struct: BanditCamp,
  },
  {
    id: '8',
    x: 120,
    y: 90,
    icon: 'sword',
    pathTo: '2',

    struct: BanditCamp,
  },
  {
    id: '9',
    x: 40,
    y: 80,
    icon: 'sword',
    pathTo: '8',

    struct: BanditCamp,
  },
];

const blBranch: StructureDescription[] = [
  {
    id: '3',
    x: -70,
    y: 10,
    icon: 'sword',
    pathTo: '1',

    struct: BanditCamp,
  },
  {
    id: '12',
    x: -120,
    y: -100,
    icon: 'mountains',
    pathTo: '3',
    struct: MountainNestStructure,
  },
];

const tlBranch: StructureDescription[] = [
  {
    id: '6',
    x: -60,
    y: -60,
    icon: 'hand-saw',
    pathTo: '1',

    struct: BanditCamp,
  },
];

const trBranch: StructureDescription[] = [
  {
    id: '4',
    x: 60,
    y: -30,
    icon: 'lighthouse',
    pathTo: '1',

    struct: BeaconOfTheUndead,
  },
];

export const initialStructs: StructureDescription[] = [
  {
    id: '1',
    x: 0,
    y: 0,
    icon: 'campfire',
  },
  ...brBranch,
  ...blBranch,
  ...tlBranch,
  ...trBranch,
];
