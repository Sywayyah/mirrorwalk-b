import { Signal, Type } from '@angular/core';
import { Observable, of } from 'rxjs';
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

export class GameObject<CreationParams extends object = object, StateT extends object = any> {
  public readonly id: string;

  public static readonly categoryId: string = 'game-object';

  private readonly api!: GameObjectApi;

  constructor(id: string) {
    this.id = id;
  }

  getState(): StateT {
    console.info(`Game object doens't have state getter:`, this);
    return null as unknown as StateT;
  }

  listenState(): Observable<StateT> {
    console.info(`Game object doens't have state listener:`, this);
    return of(null as unknown as StateT);
  }

  getStateSignal(): Signal<StateT> {
    throw new Error(`Game object doesn't have signal state ${this.id}`);
  }

  // method which is going to be called when object is created in order to initialize it.
  create(params: CreationParams): void { }

  protected getApi(): GameObjectApi {
    return this.api;
  }

  // method which is going to be called when object is being disposed
  onDestroy(): void { }

  addCustomData<T extends object>(data: T): void {
    this.api.gameObjects.addCustomData(this.id, data);
  }

  getCustomData<T extends object>(): T | undefined {
    return this.api.gameObjects.getCustomData(this.id);
  }
}

export type CreationParams<T> = T extends GameObject<infer K> ? K : never;
