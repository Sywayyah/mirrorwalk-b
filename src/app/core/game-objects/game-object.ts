import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { EventData, EventType } from 'src/app/store';
import { SpellsApi } from '../api/game-api';
import { EventFeedMessage } from '../ui';

// base for events for
export interface EventsApi {
  on<T extends object>(event: EventType<T>): Observable<T>;
  dispatch(event: EventData): void;
}

export type GameObjectClass<T extends GameObject> = Type<T> & {
  categoryId: string;
};

export interface GameObjectsManagerAPI {
  createNewGameObject<T extends GameObject>(
    gameObjectClass: GameObjectClass<T>,
    creationParams: CreationParams<T>,
    id?: string
  ): T;
  getObjectByFullId<T extends GameObject>(gameObjectId: string): T;
  destroyObject<T extends GameObject>(object: T): void;
  addCustomData<T extends object>(idOrObject: string | GameObject, data: T): void;
  getCustomData<T extends object>(idOrObject: string | GameObject): T | undefined;
}

export interface EventFeedApi {
  postEventFeedMessage(message: EventFeedMessage): void;
  pushPlainMessage(messageText: string): void;
}

// extend this api
export interface GameObjectApi {
  spells: SpellsApi;
  events: EventsApi;
  eventFeed: EventFeedApi;
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
  onDestroy(): void { }
}

export type CreationParams<T> = T extends GameObject<infer K> ? K : never;
