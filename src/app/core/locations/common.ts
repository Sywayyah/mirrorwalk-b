import { ResourceType } from '../resources';
import { ArchersOutpostStructure, BanditCamp, BeaconOfTheUndead, BigCampStructure, CalavryStalls, GraveyardStructure, MagicRiverStructure, MountainNestStructure, WitchHutStructure } from '../structures/common';
import { FireRingStructure } from '../structures/common/guard-location';
import { resourcesPileStructure, resPileStructure } from '../structures/common/resource-pile';
import { StructureDescription } from './types';

/* Think more here, customizable locations, more location types (resource piles, single guards, etc.) */

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
    id: '51',
    x: 140,
    y: -10,
    icon: 'hand-saw',
    pathTo: '5',

    struct: resPileStructure(ResourceType.Wood, 4),
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
  {
    id: '23',
    x: 75,
    y: 190,
    icon: 'mine-wagon',
    pathTo: '20',

    struct: resourcesPileStructure({ gold: 450, wood: 1, redCrystals: 1, gems: 1 }),
  },
];

const fifthBranch: StructureDescription[] = [
  {
    id: '50',
    pathTo: '1',
    x: -30,
    y: 70,
    icon: 'gold-bar',
    struct: resPileStructure(ResourceType.Gold, 650),
  }
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
    icon: 'sword',
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
  },
  {
    id: '53',

    x: 70,
    y: -170,
    icon: 'emerald',
    pathTo: '15',
    struct: resPileStructure(ResourceType.Gems, 3),
  },
  {
    id: '54',

    x: 125,
    y: -160,
    icon: 'fire-ring',
    pathTo: '15',
    struct: FireRingStructure,
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
    isRoot: true,
  },
  ...fifthBranch,
  ...brBranch,
  ...blBranch,
  ...tlBranch,
  ...trBranch,
];
