import { ResourceType } from '../../resources';
import { ArchersOutpostStructure, BanditCamp, BeaconOfTheUndead, BigCampStructure, CalavryStalls, GraveyardStructure, MagicRiverStructure, MountainNestStructure, RockyPassageStructure, ThiefsLair, WitchHutStructure } from '../common';
import { FireRingStructure } from '../common/guard-location';
import { dailyResourcesMineStructure } from '../common/resource-mine';
import { resourcesPileStructure, resPileStructure } from '../common/resource-pile';
import { StructureDescription } from '../map-structures';
import { constellationSpawn } from './preset1-const-spawn';

/* Think more here, customizable locations, more location types (resource piles, single guards, etc.) */

/*
 I think it is going to be much better if map is going to be created purely in programmatic way
  rather than trying to create a declarative approach for every possible case, because
  logic of map generation might be not very straight-forwards and differ in different game modes.

  But within this programmatic approach, any other sub-approaches can be used, declarative or not.

 LowRiskLock - location with not very risky enemies that might unlock your way towards some branches.

 LowRiskStack - this might be a low-risk location. While enemies aren't that dangerous here,
  it provides a corresponding reward (e.g. +100 xp or 350 gold).
*/
const shift = 476;

export const START_LOC_ID = 'start';

function loc(location: number): number {
  return location + shift;
}

const brBranch: StructureDescription[] = [
  {
    id: '2',
    x: loc(60),
    y: loc(30),
    icon: 'tombstone',
    pathTo: START_LOC_ID,
    struct: GraveyardStructure,
    tags: [''],
  },
  {
    id: '5',
    x: loc(120),
    y: loc(40),
    icon: 'sword',
    pathTo: '2',

    struct: BanditCamp,
  },
  {
    id: '51',
    x: loc(140),
    y: loc(-10),
    icon: 'hand-saw',
    pathTo: '5',

    struct: resPileStructure(ResourceType.Wood, 4),
  },
  {
    id: '17',
    x: loc(180),
    y: loc(60),
    icon: 'book',
    pathTo: '5',

    struct: WitchHutStructure,

  },
  {
    id: '8',
    x: loc(120),
    y: loc(90),
    icon: 'sword',
    pathTo: '2',

    struct: BanditCamp,
  },
  {
    id: '9',
    x: loc(40),
    y: loc(80),
    icon: 'sword',
    pathTo: '8',

    struct: BanditCamp,
  },
  {
    id: '22',
    x: loc(170),
    y: loc(141),
    icon: 'horseshoe',
    pathTo: '8',

    struct: CalavryStalls,
  },
  {
    id: '23',
    x: loc(240),
    y: loc(148),
    icon: 'hand-saw',
    pathTo: '22',

    struct: dailyResourcesMineStructure({ wood: 1 }),
  },
  {
    id: '20',
    x: loc(45),
    y: loc(145),
    icon: 'monster-skull',
    pathTo: '9',

    struct: BigCampStructure,
  },

];

const fifthBranch: StructureDescription[] = [
  {
    id: '50',
    pathTo: START_LOC_ID,
    x: loc(-30),
    y: loc(70),
    icon: 'gold-bar',
    struct: resPileStructure(ResourceType.Gold, 650),
  },

];

const blBranch: StructureDescription[] = [
  {
    id: '3',
    x: loc(-70),
    y: loc(10),
    icon: 'sword',
    pathTo: START_LOC_ID,

    struct: BanditCamp,
  },
  {
    id: '12',
    x: loc(-120),
    y: loc(-100),
    icon: 'mountains',
    pathTo: '3',
    struct: MountainNestStructure,
  },
  {
    id: 'left-2',
    x: loc(-130),
    y: loc(55),
    icon: 'sword',
    pathTo: '3',

    struct: BanditCamp,
  },
  {
    id: 'left-5',
    x: loc(-120),
    y: loc(-10),
    icon: 'campfire',
    pathTo: 'left-2',

    struct: ThiefsLair,
  },
  {
    id: '54',

    x: loc(-190),
    y: loc(20),
    icon: 'fire-ring',
    pathTo: 'left-2',
    struct: FireRingStructure,
  },
  {
    id: 'boss-1',

    x: loc(-250),
    y: loc(-50),
    icon: 'monster-skull',
    pathTo: '54',
    struct: RockyPassageStructure,
    // attackerStaticMods: {
    //   playerBonusAttack: -2,
    //   resistFire: -10,
    // },
  },
  {
    id: 'left-3',
    x: loc(-190),
    y: loc(90),
    icon: 'mine-wagon',
    pathTo: 'left-2',

    struct: resourcesPileStructure({ gold: 450, redCrystals: 1, gems: 1 }),
  },
];

const tlBranch: StructureDescription[] = [
  {
    id: '6',
    x: loc(-60),
    y: loc(-60),
    icon: 'sword',
    pathTo: START_LOC_ID,

    struct: BanditCamp,
  },
  {
    id: '14',
    x: loc(-40),
    y: loc(-120),
    icon: 'incense',
    pathTo: '6',

    struct: MagicRiverStructure,
  },
  {
    id: '15',

    x: loc(50),
    y: loc(-110),
    icon: 'tower',
    pathTo: '6',

    struct: ArchersOutpostStructure,
  },
  {
    id: '53',

    x: loc(70),
    y: loc(-170),
    icon: 'emerald',
    pathTo: '15',
    struct: resPileStructure(ResourceType.Gems, 3),
  },

];

const trBranch: StructureDescription[] = [
  {
    id: '4',
    x: loc(60),
    y: loc(-30),
    icon: 'lighthouse',
    pathTo: START_LOC_ID,

    struct: BeaconOfTheUndead,
  },
];

export const structsPreset1: StructureDescription[] = [
  {
    id: START_LOC_ID,
    x: loc(0),
    y: loc(0),
    icon: 'campfire',
  },
  ...fifthBranch,
  ...brBranch,
  ...blBranch,
  ...tlBranch,
  ...trBranch,
  ...constellationSpawn,
];
