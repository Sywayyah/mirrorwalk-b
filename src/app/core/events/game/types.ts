import { Item } from 'src/app/core/items';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { UnitGroup } from 'src/app/core/unit-types';
import { GameObject } from '../../game-objects';
import { Hero } from '../../heroes';
import { MapStructure } from '../../structures';
import { Building } from '../../towns';

export enum ViewsEnum {
  MainScreen = 'main-screen',
  NewGame = 'new-game',

  Structures = 'structures',
  Battleground = 'battleground',
  Town = 'town',
}

export type StructSelectedEvent = { struct: MapStructure };
export type NeutralStructParams = { struct: MapStructure };
export type NewDayParams = { day: number };
export type NewWeekParams = { week: number };
export type FightStartsEvent = { unitGroups: UnitGroup[], players: Player[] };
export type InitSpellAction = { spell: Spell, player: Player, ownerUnit?: UnitGroup };
export type InitItemAction = { item: Item, ownerPlayer: Player };
export type InitBuildingAction = { player: Player, building: Building };
export type InitMapStructureAction = { structure: MapStructure };
export type PlayerEquipsItemAction = { player: Player, item: Item };
export type PlayerUnequipsItemAction = { player: Player, item: Item };

export type PanMapCameraCenterAction = { x: number; y: number; };

export type PlayerLevelsUpEvent = { newLevel: number, hero: Hero };

export interface RewardModel {
  display: {
    icon: string;
    title: string;
  },
  onSumbit: () => void,
}

export type DisplayPlayerRewardAction = { title: string; subTitle: string; rewards: RewardModel[] };
export type InitGameObjectApiParams = { gameObject: GameObject };
