import { ArchersOutpostStructure, BanditCamp, BeaconOfTheUndead, BigCampStructure, CalavryStalls, GraveyardStructure, MagicRiverStructure, MountainNestStructure, RockyPassageStructure, ThievesLair, WitchHutStructure } from '../common';
import { DarkArtsSchool } from '../common/dark-arts-school';
import { FireRingStructure } from '../common/guard-location';
import { Mausoleum } from '../common/mausoleum';
import { DailyResourcesMineStructure } from '../common/resource-mine';
import { getResPileParams, ResourcesPileStructure } from '../common/resource-pile';
import { StructureDescription } from '../map-structures';
import { createLocationsBranch } from '../utils';
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


const brBranch: StructureDescription[] = createLocationsBranch('start-bottom-right', [
  {
    id: 'entry',
    x: loc(60),
    y: loc(30),
    icon: 'tombstone',

    pathTo: START_LOC_ID,
    toOuterBranch: true,

    struct: GraveyardStructure,
    tags: [''],
  },
  {
    id: '1',
    x: loc(120),
    y: loc(40),
    icon: 'sword',
    pathTo: 'entry',

    struct: BanditCamp,
  },
  {
    id: '1-1',
    x: loc(140),
    y: loc(-10),
    icon: 'hand-saw',
    pathTo: '1',
    actionPoints: 1,

    struct: ResourcesPileStructure,
    structParams: getResPileParams({ wood: 4 })
  },
  {
    id: 'witch',
    x: loc(180),
    y: loc(60),
    icon: 'book',
    pathTo: '1',

    struct: WitchHutStructure,
  },
  {
    id: '5',
    x: loc(120),
    y: loc(90),
    icon: 'sword',
    pathTo: '1',


    struct: BanditCamp,
  },
  {
    id: 'pre-boss',
    x: loc(40),
    y: loc(80),
    icon: 'sword',
    pathTo: '5',

    struct: BanditCamp,
  },
  {
    id: '7',
    x: loc(170),
    y: loc(141),
    icon: 'horseshoe',
    pathTo: '5',

    struct: CalavryStalls,
  },
  {
    id: '7-1',
    pathTo: '7',
    x: loc(165),
    y: loc(201),
    icon: 'scroll-unfurled',
    struct: DarkArtsSchool,
  },
  {
    id: '7-2',
    actionPoints: 2,
    x: loc(240),
    y: loc(148),
    icon: 'hand-saw',
    pathTo: '7',

    struct: DailyResourcesMineStructure,
    structParams: getResPileParams({ wood: 1 }),
  },
  {
    id: 'boss',
    x: loc(45),
    y: loc(145),
    icon: 'monster-skull',
    pathTo: 'pre-boss',
    actionPoints: 2,

    struct: BigCampStructure,
  },
]);


const fifthBranch: StructureDescription[] = createLocationsBranch('five', [
  {
    id: '1',
    pathTo: START_LOC_ID,
    toOuterBranch: true,
    x: loc(-30),
    y: loc(70),
    icon: 'gold-bar',
    actionPoints: 1,
    struct: ResourcesPileStructure,
    structParams: getResPileParams({ gold: 650 }),
  },
]);

const blBranch: StructureDescription[] = createLocationsBranch('start-bottom-left', [
  {
    id: 'entry',
    x: loc(-70),
    y: loc(10),
    icon: 'sword',
    pathTo: START_LOC_ID,
    toOuterBranch: true,

    struct: BanditCamp,
  },
  {
    id: '1',
    x: loc(-120),
    y: loc(-100),
    icon: 'mountains',
    pathTo: 'entry',
    struct: MountainNestStructure,
  },
  {
    id: '2',
    x: loc(-130),
    y: loc(55),
    icon: 'sword',
    pathTo: 'entry',

    struct: BanditCamp,
  },
  {
    id: '3',
    x: loc(-120),
    y: loc(-10),
    icon: 'campfire',
    pathTo: '2',

    struct: ThievesLair,
  },
  {
    id: '4',
    actionPoints: 4,
    x: loc(-180),
    y: loc(-80),
    icon: 'crystals',
    pathTo: '3',

    struct: DailyResourcesMineStructure,
    structParams: getResPileParams({ redCrystals: 1 }),
  },
  {
    id: 'pre-boss',

    x: loc(-190),
    y: loc(20),
    icon: 'fire-ring',
    pathTo: '2',
    struct: FireRingStructure,
    actionPoints: 2,
  },
  {
    id: 'boss',

    x: loc(-250),
    y: loc(-50),
    icon: 'monster-skull',
    pathTo: 'pre-boss',
    struct: RockyPassageStructure,
    // attackerStaticMods: {
    //   playerBonusAttack: -2,
    //   resistFire: -10,
    // },
    actionPoints: 2,
  },
  {
    id: 'post-boss',
    pathTo: 'boss',
    icon: 'capitol',
    x: loc(-300),
    y: loc(-80),
    actionPoints: 2,
    struct: Mausoleum,
  },
  {
    id: 'wagon',
    x: loc(-190),
    y: loc(90),
    icon: 'mine-wagon',
    pathTo: '2',

    struct: ResourcesPileStructure,
    structParams: getResPileParams({ gold: 450, redCrystals: 1, gems: 1 })
  },
]);

const tlBranch: StructureDescription[] = createLocationsBranch('start-top-left', [
  {
    id: 'entry',
    x: loc(-60),
    y: loc(-60),
    icon: 'sword',
    pathTo: START_LOC_ID,
    toOuterBranch: true,

    struct: BanditCamp,
  },
  {
    id: 'river',
    x: loc(-40),
    y: loc(-120),
    icon: 'incense',
    pathTo: 'entry',

    struct: MagicRiverStructure,
    actionPoints: 1,
  },
  {
    id: '1',

    x: loc(50),
    y: loc(-110),
    icon: 'tower',
    pathTo: 'entry',

    struct: ArchersOutpostStructure,
    actionPoints: 1,
  },
  {
    id: 'gems',

    x: loc(70),
    y: loc(-170),
    icon: 'emerald',
    pathTo: '1',
    struct: ResourcesPileStructure,
    structParams: getResPileParams({ gems: 3 }),
  },

]);

const trBranch: StructureDescription[] = createLocationsBranch('start-top-right', [
  // {
  //   id: '4',
  //   icon: 'locked-fortress',
  //   x: loc(60),
  //   y: loc(-30),
  //   pathTo: START_LOC_ID,
  //   struct: SettlementLocation,
  // },
  {
    id: 'beacon',
    x: loc(35),
    y: loc(-50),
    icon: 'lighthouse',
    pathTo: START_LOC_ID,
    toOuterBranch: true,

    struct: BeaconOfTheUndead,
  },
  // {
  //   id: '4-2',
  //   actionPoints: 1,
  //   icon: 'locked-fortress',
  //   x: loc(-70),
  //   y: loc(270),
  //   pathTo: '4',
  //   struct: resPileStructure(ResourceType.Gems, 2),
  // },
]);

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
