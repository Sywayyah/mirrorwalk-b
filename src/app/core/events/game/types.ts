import { ItemInstanceModel } from 'src/app/core/items';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellInstance } from 'src/app/core/spells';
import { NeutralCampStructure, StructureModel } from 'src/app/core/structures';
import { UnitGroupInstModel } from 'src/app/core/unit-types';
import { Hero } from '../../heroes';

export type StructSelectedEvent = { struct: StructureModel };
export type NeutralStructParams = { struct: NeutralCampStructure };
export type NewDayParams = { day: number };
export type FightStartsEvent = { unitGroups: UnitGroupInstModel[], players: PlayerInstanceModel[] };
export type InitSpellAction = { spell: SpellInstance, player: PlayerInstanceModel, ownerUnit?: UnitGroupInstModel };
export type InitItemAction = { item: ItemInstanceModel, ownerPlayer: PlayerInstanceModel };
export type PlayerEquipsItemAction = { player: PlayerInstanceModel, item: ItemInstanceModel };
export type PlayerUnequipsItemAction = { player: PlayerInstanceModel, item: ItemInstanceModel };

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
