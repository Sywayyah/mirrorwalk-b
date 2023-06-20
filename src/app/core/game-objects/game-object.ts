import { EventType } from 'src/app/store';
import { SpellsApi } from '../api/game-api';
import { Observable } from 'rxjs';
import { Type } from '@angular/core';

// base for events for
export interface EventsApi {
  on<T extends object>(event: EventType<T>): Observable<T>;
}

export type GameObjectClass<T extends GameObject> = Type<T> & {
  categoryId: string;
};

export interface GameObjectsManagerAPI {
  createNewGameObject<T extends GameObject>(gameObjectClass: GameObjectClass<T>, creationParams: CreationParams<T>, id?: string): T;
}

// extend this api
export interface GameObjectApi {
  spells: SpellsApi;
  events: EventsApi;
  gameObjects: GameObjectsManagerAPI;
}

export class GameObject<CreationParams extends object = object> {
  public readonly id: string;

  public static readonly categoryId: string = 'game-object';

  private readonly api!: GameObjectApi;

  constructor(id: string) {
    this.id = id;
  }

  // method which is going to be called when object is created in order to initialize it.
  create(params: CreationParams): void { }

  protected getApi(): GameObjectApi {
    return this.api;
  }

  // method which is going to be called when object is being disposed
  onDestroy(): void {}
}

export type CreationParams<T> = T extends GameObject<infer K> ? K : never;
