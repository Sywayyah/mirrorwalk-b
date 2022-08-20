import { SpellCreationOptions } from "../combat-api/combat-api.types";
import { PlayerInstanceModel, UnitGroupInstModel } from "../main.model";
import { SpellInstance, SpellModel } from "../spells";

export interface PlayersApi {
    addManaToPlayer: (player: PlayerInstanceModel, mana: number) => void;
    addMaxManaToPlayer: (player: PlayerInstanceModel, plusToMaxMana: number) => void;

    addSpellToPlayerHero: (player: PlayerInstanceModel, spell: SpellInstance) => void;

    getCurrentPlayer: () => PlayerInstanceModel;
    getCurrentPlayerUnitGroups: () => UnitGroupInstModel[];
}

export interface SpellsApi {
    createSpellInstance: <T>(spell: SpellModel<T>, options?: SpellCreationOptions<T>) => SpellInstance<T>;
}