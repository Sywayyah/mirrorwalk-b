import type { PlayerInstanceModel, UnitGroupInstModel } from "../main.model";
import type { SpellInstance } from "./spell.types";

export enum SpellEventTypes {
    PlayerTargetsSpell,
    PlayerCastsInstantSpell,
    SpellPlacedOnUnitGroup,
    NewRoundBegins,
}

export interface TargetSelected {
    target: UnitGroupInstModel;
}

export interface NewRoundBegins {
    round: number;
}

export interface SpellEventsMapping {
    [SpellEventTypes.PlayerTargetsSpell]: TargetSelected;
    [SpellEventTypes.SpellPlacedOnUnitGroup]: TargetSelected;
    [SpellEventTypes.NewRoundBegins]: NewRoundBegins;
    [SpellEventTypes.PlayerCastsInstantSpell]: { player: PlayerInstanceModel, spell: SpellInstance };
}

export type SpellEventHandlers = { [K in keyof SpellEventsMapping]?: (target: SpellEventsMapping[K]) => void };

