import { EventType } from 'src/app/store';
import { SpellsApi } from '../api/game-api';
import { Observable } from 'rxjs';

// base for events for
export interface EventsApi {
  on<T extends object>(event: EventType<T>): Observable<T>;
}

// extend this api
export interface GameObjectApi {
  spells: SpellsApi;
  events: EventsApi;
}

export class GameObject<CreationParams extends object = object> {
  public readonly id: string;

  public static readonly categoryId: string = 'game-object';

  private readonly api!: GameObjectApi;

  constructor(id: string) {
    this.id = id;
  }

  create(params: CreationParams): void { }

  protected getApi(): GameObjectApi {
    return this.api;
  }
}

export type CreationParams<T> = T extends GameObject<infer K> ? K : never;
