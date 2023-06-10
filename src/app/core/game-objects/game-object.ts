import { SpellsApi } from '../api/game-api';

// extend this api
export interface GameObjectApi {
  spells: SpellsApi;
}

export class GameObject<CreationParams extends object = object> {
  public readonly id: string;

  public static readonly categoryId: string = 'game-object';

  private readonly api!: { spells: SpellsApi };

  constructor(id: string) {
    this.id = id;
  }

  create(params: CreationParams): void { }

  protected getApi(): GameObjectApi {
    return this.api;
  }
}

export type CreationParams<T> = T extends GameObject<infer K> ? K : never;
