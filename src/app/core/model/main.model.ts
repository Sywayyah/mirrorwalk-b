import { AbilityModel } from "./abilities.types";
import { ResourcesModel } from "./resources.types";

interface RequirementModel extends Partial<ResourcesModel> {
    /* heroLevel?: number;
    gold?: number;
    redCrystals?: number;
    glory?: number;
    gems?: number; */
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

    /* Similar to Homm3 system, where each point of difference between attack/defence increases damage by 5 percent */
    attackRating: number;

    damageInfo: UnitDamageModel;
}

export interface UnitTypeModel {
    /* displayed name */
    name: string;
    /* main portrait for this unit (used during combat, hiring and so on) */
    mainPortraitUrl?: string;

    level: number;

    baseStats: UnitTypeBaseStatsModel;

    /* what does this unit type requires */
    baseRequirements: RequirementModel;

    /* base reward from neutral camps */
    neutralReward: {
        gold: number;
        experience: number;
    };

    /* create a separate mapping, table UnitGroup->Abilities */
    /*  Associative tables.. can be useful. Don't need to overgrow the model */
    baseAbilities?: AbilityModel[];

    /* minimal amount of units that can stack can be hired, sold or split by */
    minQuantityPerStack: number;

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
    ownerPlayerRef?: PlayerInstanceModel;

    /* how much turns left during round, not sure if it's best to have it there */
    turnsLeft: number;
    /* the last unit hp tail. If undefined, the tail unit hp is full */
    tailUnitHp?: number;
}

export interface UnitGroupInstModel extends UnitGroupModel {
    ownerPlayerRef: PlayerInstanceModel;

    spells: SpellModel[];
}




export enum PlayerTypeEnum {
    Player = 'Player',
    AI = 'AI',
}

/* todo: seems reasonable to have heroes and players models as well */
export interface PlayerModel {
    color: string;

    /* resources can be stored separately in theory. */
    resources: ResourcesModel;

    type: PlayerTypeEnum;

    hero: HeroModel;

    unitGroups: UnitGroupModel[];
}

export interface PlayerInstanceModel extends PlayerModel {
    id: string;
}


/* Hero model */
export interface HeroModel {
    name: string | null;
    experience: number;
    level: number;
    freeSkillpoints: number;
    // abilities?: AbilityTypeModel[];
    spells: SpellModel[];
}

export enum SpellActivationType {
    Target = 'target',
    Instant = 'instant',
    Passive = 'passive',

    //  special type of ability, can be added to the unit group for some
    // continuous effect. When unit group dies, debuff gets removed and unregistered. 
    Debuff = 'debuff',
}

/* Spell model */

export type DefaultSpellStateType = unknown;

export interface SpellModel<SpellStateType = DefaultSpellStateType> {
    name: string;
    level: number;
    activationType: SpellActivationType;

    type: SpellTypeModel<SpellStateType>;
    instanceData?: SpellStateType;
}

export interface SpellTypeModel<SpellStateType> {
    spellConfig: SpellConfig<SpellStateType>;
    spellInfo: { name: string; };
}

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
    [SpellEventTypes.PlayerCastsInstantSpell]: { player: PlayerInstanceModel, spell: SpellModel };
}

export type SpellEventHandlers = { [K in keyof SpellEventsMapping]?: (target: SpellEventsMapping[K]) => void };

export interface SpellCombatEventsRef {
    on: (handlers: SpellEventHandlers) => void;
}

export interface PostDamageInfo {
    unitLoss: number
}

export enum DamageType {
    PhysicalAttack = 'physAttack',
    Physical = 'physical',
    Magic = 'magic',
}

export interface SpellCombatActionsRef {
    dealDamageTo: (
        target: UnitGroupInstModel,
        damage: number,
        damageType: DamageType,
        postActionFn?: (actionInfo: PostDamageInfo) => void,
    ) => void;

    // Creates shallow clone of spell that is passed, registers it inside battle events system
    //  adds it to the target group and returning the reference of the created spell.
    addSpellToUnitGroup: <T = DefaultSpellStateType>(
        target: UnitGroupInstModel,
        spell: SpellModel<T>,
        ownerPlayer: PlayerInstanceModel,
    ) => SpellModel<T>;

    // Removes spell instance from the target unit group and from battle events system.
    removeSpellFromUnitGroup: <T = DefaultSpellStateType>(
        target: UnitGroupInstModel,
        spell: SpellModel<T>,
    ) => void;

    getRandomEnemyPlayerGroup: () => UnitGroupInstModel;

    historyLog: (plainMsg: string) => void;
}

export interface SpellCombatRefsModel<SpellStateType> {
    events: SpellCombatEventsRef;
    actions: SpellCombatActionsRef;
    thisSpell: SpellModel<SpellStateType>;
    ownerPlayer: PlayerInstanceModel;
    ownerHero: HeroModel;
}

export interface SpellConfig<SpellStateType> {
    init: (combatRefs: SpellCombatRefsModel<SpellStateType>) => void;
}