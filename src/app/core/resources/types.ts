export enum ResourceType {
    Gold = 'gold',
    Wood = 'wood',
    RedCrystals = 'redCrystals',
    Gems = 'gems',
}

export interface ResourcesModel {
    [ResourceType.Gold]: number;
    [ResourceType.Wood]: number;

    [ResourceType.RedCrystals]: number;
    [ResourceType.Gems]: number;
}

export type Resources = Partial<ResourcesModel>;
