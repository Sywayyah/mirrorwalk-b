
interface RequirementModel {
    playerHeroLevel?: number;
    playerGold?: number;
    playerBloodCrystals?: number;
    playerGloryLevel?: number;
}

enum UnitDamageTypesEnum {
    Physical,
}

interface UnitDamageModel {
    minDamage: number;
    maxDamage: number;
    type?: UnitDamageTypesEnum;
}

export interface UnitTypeBaseStatsModel {
    /* base health of single unit of this type */
    health: number;
    /* base speed of this unit type. speed defines how early in the battle order can be placed */
    speed: number;
    /* base defence of this unit type, each 15 poins of defense increase EHP by 100% */
    /* maybe defence types can be different, although I don't really think I want to have
        paper-rock-scissors here  */
    defence: number;

    damageInfo: UnitDamageModel;
}

export interface UnitTypeModel {
    /* displayed name */
    name: string;
    /* main portrait for this unit (used during combat, hiring and so on) */
    mainPortraitUrl?: string;

    baseStats: UnitTypeBaseStatsModel;

    /* minimal amount of units that can stack can be hired, sold or split by */
    minQuantityPerStack: number;

    /* what does this unit type requires */
    baseRequirements: RequirementModel;

    /* How many attacks unit can make by default */
    defaultTurnsPerRound: number;
}

interface ItemTypeModel {
    name: string;
    mainIconUrl: string;

    /* what does this item type requires */
    requirements: RequirementModel;
}



export interface UnitGroupModel {
    count: number;
    type: UnitTypeModel;
    ownerPlayerRef?: PlayerModel;
}

export interface ResourcesModel {
    gold: number;

    redCrystals: number;
    gems: number;

}


export enum PlayerTypeEnum {
    Player = 'player',
    AI = 'ai',
}

/* todo: seems reasonable to have heroes and players models as well */
export interface PlayerModel {
    color: string;

    /* resources can be stored separately in theory. */
    resources?: ResourcesModel;

    type: PlayerTypeEnum;
}

export interface HeroModel {

}

