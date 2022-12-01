import { ItemInstanceModel } from 'src/app/core/items';
import { PlayerInstanceModel } from 'src/app/core/players';
import { SpellInstance } from 'src/app/core/spells';
import { NeutralCampStructure, StructureModel } from 'src/app/core/structures';
import { PopupModel } from 'src/app/core/ui';
import { UnitGroupInstModel } from 'src/app/core/unit-types';

export type StructSelectedEvent = { struct: StructureModel };
export type NeutralStructParams = { struct: NeutralCampStructure };
export type DisplayPopupEvent = { popup: PopupModel };
export type FightStartsEvent = { unitGroups: UnitGroupInstModel[], players: PlayerInstanceModel[] };
export type InitSpellAction = { spell: SpellInstance, player: PlayerInstanceModel, ownerUnit?: UnitGroupInstModel };
export type InitItemAction = { item: ItemInstanceModel, ownerPlayer: PlayerInstanceModel };
export type PlayerEquipsItemAction = { player: PlayerInstanceModel, item: ItemInstanceModel };
export type PlayerUnequipsItemAction = { player: PlayerInstanceModel, item: ItemInstanceModel };
