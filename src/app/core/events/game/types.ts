import { Item } from 'src/app/core/items';
import { Player } from 'src/app/core/players';
import { Spell } from 'src/app/core/spells';
import { StructureModel } from 'src/app/core/structures';
import { UnitGroup } from 'src/app/core/unit-types';
import { Hero } from '../../heroes';
import { GameObject } from '../../game-objects';

export type StructSelectedEvent = { struct: StructureModel };
export type NeutralStructParams = { struct: StructureModel };
export type NewDayParams = { day: number };
export type FightStartsEvent = { unitGroups: UnitGroup[], players: Player[] };
export type InitSpellAction = { spell: Spell, player: Player, ownerUnit?: UnitGroup };
export type InitItemAction = { item: Item, ownerPlayer: Player };
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
