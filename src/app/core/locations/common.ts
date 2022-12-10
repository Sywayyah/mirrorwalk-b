import { StructureGeneratorModel, StructureModel } from '../structures';
import { ArchersOutpostStructure, BanditCamp, BeaconOfTheUndead, BigCampStructure, CalavryStalls, GraveyardStructure, MagicRiverStructure, MountainNestStructure, WitchHutStructure } from '../structures/common';

/* Think more here, customizable locations, more location types (resource piles, single guards, etc.) */

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
    id: '17',
    x: 180,
    y: 60,
    icon: 'book',
    pathTo: '5',

    struct: WitchHutStructure,

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
  {
    id: '22',
    x: 170,
    y: 141,
    icon: 'horseshoe',
    pathTo: '8',

    struct: CalavryStalls,
  },
  {
    id: '20',
    x: 45,
    y: 145,
    icon: 'monster-skull',
    pathTo: '9',

    struct: BigCampStructure,
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
  {
    id: '14',
    x: -40,
    y: -120,
    icon: 'incense',
    pathTo: '6',

    struct: MagicRiverStructure,
  },
  {
    id: '15',

    x: 50,
    y: -110,
    icon: 'tower',
    pathTo: '6',

    struct: ArchersOutpostStructure,
  }
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
    isRoot: true,
  },
  ...brBranch,
  ...blBranch,
  ...tlBranch,
  ...trBranch,
];
