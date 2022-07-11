import { PlayerInstanceModel } from "../main.model";

export interface GameApi {
    addManaToPlayer: (player: PlayerInstanceModel, mana: number) => void,
    addMaxManaToPlayer: (player: PlayerInstanceModel, plusToMaxMana: number) => void;
}